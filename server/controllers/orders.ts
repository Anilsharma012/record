import crypto from 'crypto';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { Package, PriceRule } from '../models/Package';
import { Transaction } from '../models/Transaction';
import { Subscription } from '../models/Subscription';

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

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const r = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(price * 100),
          currency: 'INR',
          receipt: String(order._id),
          notes: {
            userId: String(req.user?._id || ''),
            packageId: String(packageId),
            cityId: cityId || '',
            areaId: areaId || ''
          }
        })
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Razorpay order failed: ${text}`);
      }
      const rpOrder = await r.json();

      const txn = new Transaction({
        sellerId: req.user?._id,
        packageId,
        amount: price,
        currency: 'INR',
        orderId: rpOrder.id,
        status: 'created'
      });
      await txn.save();

      return res.json({
        gateway: 'razorpay',
        keyId,
        order: { id: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency },
        localOrderId: order._id
      });
    }

    // No gateway keys configured; keep pending or mark paid based on business rule
    return res.json({ status: 'pending', localOrderId: order._id, amount: price });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Checkout failed' });
  }
};

export const verify = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = req.body as any;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return res.status(400).json({ message: 'Gateway not configured' });

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ message: 'Invalid signature' });

    const txn = await Transaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'paid', paymentId: razorpay_payment_id, method: 'razorpay' },
      { new: true }
    );

    const order = await Order.findByIdAndUpdate(localOrderId, { status: 'paid' }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const pack = await Package.findById(order.packageId);
    if (pack) {
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

    res.json({ ok: true, transactionId: txn?._id || null });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Verification failed' });
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

    const event = req.body?.event as string | undefined;
    if (event === 'payment.captured') {
      const payment = (req.body as any).payload?.payment?.entity;
      if (payment?.order_id && payment?.id) {
        await Transaction.findOneAndUpdate(
          { orderId: payment.order_id },
          { status: 'paid', paymentId: payment.id, method: payment.method || 'razorpay' }
        );
        const receipt = (req.body as any).payload?.order?.entity?.receipt;
        if (receipt) {
          const order = await Order.findByIdAndUpdate(receipt, { status: 'paid' }, { new: true });
          if (order) {
            const pack = await Package.findById(order.packageId);
            if (pack) {
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
          }
        }
      }
    }

    res.json({ received: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Webhook error' });
  }
};
