import crypto from 'crypto';
import { Response } from 'express';
import { Types } from 'mongoose';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { Package, PriceRule } from '../models/Package';
import { Transaction } from '../models/Transaction';
import { Subscription } from '../models/Subscription';
import { getGatewayCreds } from './gateways';

async function computePrice(packageId: string, cityId?: string, areaId?: string) {
  const pack = await Package.findById(packageId);
  if (!pack || !pack.isActive) throw new Error('Invalid or inactive package');
  const base = pack.basePrice;
  const rule = await PriceRule.findOne({
    $or: [
      areaId ? { scope: 'area', refId: areaId, packageId } : undefined,
      cityId ? { scope: 'city', refId: cityId, packageId } : undefined,
    ].filter(Boolean) as any,
  });
  return { price: rule ? rule.price : base, pack };
}

function getBaseUrl(req: any) {
  return `${req.protocol}://${req.get('host')}`;
}

function createPhonePeHeaders(path: string, base64Payload: string, saltKey: string, saltIndex: string, merchantId: string) {
  const xVerify = crypto.createHash('sha256').update(base64Payload + path + saltKey).digest('hex') + '###' + (saltIndex || '1');
  return {
    'Content-Type': 'application/json',
    'X-VERIFY': xVerify,
    'X-MERCHANT-ID': merchantId || ''
  } as Record<string, string>;
}

async function activateSubscription(orderId: any) {
  const order = await Order.findById(orderId);
  if (!order) return;
  const pack = await Package.findById(order.packageId);
  if (!pack) return;
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sub = new Subscription({
    sellerId: order.userId,
    packageId: order.packageId,
    startAt: now,
    endAt: end,
    remainingListings: pack.features?.maxListings || 0,
    remainingFeatured: pack.features?.featured ? 1 : 0,
    remainingBumps: pack.features?.boostDays || 0,
    status: 'active'
  });
  await sub.save();
}

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    const { packageId, cityId, areaId } = (req.body || {}) as { packageId: string; cityId?: string; areaId?: string };

    if (!Types.ObjectId.isValid(String(packageId))) {
      return res.status(400).json({ message: 'Invalid packageId' });
    }
    if (cityId && !Types.ObjectId.isValid(String(cityId))) {
      return res.status(400).json({ message: 'Invalid cityId' });
    }
    if (areaId && !Types.ObjectId.isValid(String(areaId))) {
      return res.status(400).json({ message: 'Invalid areaId' });
    }

    const { price } = await computePrice(packageId, cityId, areaId);

    const order = new Order({ userId: req.user?._id, packageId, price, cityId, areaId, status: 'pending' });
    await order.save();

    // Prefer PhonePe if configured
    const phonepeConf = await getGatewayCreds('phonepe');
    const merchantId = (phonepeConf.creds as any)?.merchantId || process.env.PHONEPE_MERCHANT_ID;
    const saltKey = (phonepeConf.creds as any)?.saltKey || process.env.PHONEPE_SALT_KEY;
    const saltIndex = (phonepeConf.creds as any)?.saltIndex || process.env.PHONEPE_SALT_INDEX || '1';
    const phonepeEnv = (phonepeConf.creds as any)?.env || process.env.PHONEPE_ENV;
    if (merchantId && saltKey) {
      const envBase = phonepeEnv === 'prod'
        ? 'https://api.phonepe.com/apis/hermes'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
      const path = '/pg/v1/pay';
      const baseUrl = getBaseUrl(req);
      const payload = {
        merchantId,
        merchantTransactionId: String(order._id),
        merchantUserId: String(req.user?._id || ''),
        amount: Math.round(price * 100),
        redirectUrl: `${baseUrl}/api/orders/phonepe/callback?orderId=${order._id}`,
        redirectMode: 'POST',
        callbackUrl: `${baseUrl}/api/orders/phonepe/callback?orderId=${order._id}`,
        paymentInstrument: { type: 'PAY_PAGE' }
      };
      const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
      const headers = createPhonePeHeaders(path, base64, saltKey, saltIndex, merchantId);
      const r = await fetch(`${envBase}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ request: base64 })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false) {
        throw new Error(`PhonePe order failed: ${JSON.stringify(j)}`);
      }
      const redirectUrl = j?.data?.instrumentResponse?.redirectInfo?.url || j?.data?.redirectUrl || '';

      await new Transaction({ sellerId: req.user?._id, packageId, amount: price, currency: 'INR', orderId: String(order._id), status: 'created', method: 'phonepe' }).save();
      return res.json({ gateway: 'phonepe', redirectUrl, localOrderId: order._id });
    }

    // Fallback to Razorpay if configured
    const rpConf = await getGatewayCreds('razorpay');
    const keyId = (rpConf.creds as any)?.keyId || process.env.RAZORPAY_KEY_ID;
    const keySecret = (rpConf.creds as any)?.keySecret || process.env.RAZORPAY_KEY_SECRET;
    if (keyId && keySecret) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const r = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: Math.round(price * 100), currency: 'INR', receipt: String(order._id) })
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Razorpay order failed: ${text}`);
      }
      const rpOrder = await r.json();
      await new Transaction({ sellerId: req.user?._id, packageId, amount: price, currency: 'INR', orderId: rpOrder.id, status: 'created', method: 'razorpay' }).save();
      return res.json({ gateway: 'razorpay', keyId, order: { id: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency }, localOrderId: order._id });
    }

    return res.json({ status: 'pending', localOrderId: order._id, amount: price });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Checkout failed' });
  }
};

export const verify = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = req.body as any;
    const rpConf = await getGatewayCreds('razorpay');
    const keySecret = (rpConf.creds as any)?.keySecret || process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return res.status(400).json({ message: 'Gateway not configured' });

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ message: 'Invalid signature' });

    await Transaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'paid', paymentId: razorpay_payment_id, method: 'razorpay' },
      { new: true }
    );
    await Order.findByIdAndUpdate(localOrderId, { status: 'paid' });
    await activateSubscription(localOrderId);

    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Verification failed' });
  }
};

export const phonepeCallback = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = (req.query.orderId as string) || (req.body?.orderId as string) || '';
    const phonepeConf = await getGatewayCreds('phonepe');
    const merchantId = ((phonepeConf.creds as any)?.merchantId || process.env.PHONEPE_MERCHANT_ID || '') as string;
    const phonepeEnv = ((phonepeConf.creds as any)?.env || process.env.PHONEPE_ENV) as string | undefined;
    const saltKey = ((phonepeConf.creds as any)?.saltKey || process.env.PHONEPE_SALT_KEY || '') as string;
    const saltIndex = ((phonepeConf.creds as any)?.saltIndex || process.env.PHONEPE_SALT_INDEX || '1') as string;
    const envBase = phonepeEnv === 'prod' ? 'https://api.phonepe.com/apis/hermes' : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    const path = `/pg/v1/status/${merchantId}/${orderId}`;
    const headers = createPhonePeHeaders(path, '', saltKey, saltIndex, merchantId);
    const r = await fetch(`${envBase}${path}`, { method: 'GET', headers });
    const j = await r.json().catch(() => ({}));

    if (j?.code === 'PAYMENT_SUCCESS' || j?.data?.responseCode === 'SUCCESS') {
      await Transaction.findOneAndUpdate({ orderId: String(orderId) }, { status: 'paid', method: 'phonepe' });
      await Order.findByIdAndUpdate(orderId, { status: 'paid' });
      await activateSubscription(orderId);
      const base = getBaseUrl(req);
      return res.redirect(302, `${base}/transactions?status=success`);
    }

    const base = getBaseUrl(req);
    return res.redirect(302, `${base}/transactions?status=failed`);
  } catch (e: any) {
    const base = getBaseUrl(req as any);
    return res.redirect(302, `${base}/transactions?status=error`);
  }
};

export const webhook = async (req: AuthRequest, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string | undefined;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!signature || !secret) return res.json({ received: true });

    const body = JSON.stringify(req.body);
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (expected !== signature) return res.status(400).json({ message: 'Invalid webhook signature' });

    res.json({ received: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Webhook error' });
  }
};
