import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Transaction } from '../models/Transaction';
import { Order } from '../models/Order';
import { Package } from '../models/Package';
import { Subscription } from '../models/Subscription';

async function activate(orderId: any) {
  const order = await Order.findById(orderId);
  if (!order) return;
  const pack = await Package.findById(order.packageId);
  if (!pack) return;
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  await new Subscription({
    sellerId: order.userId,
    packageId: order.packageId,
    startAt: now,
    endAt: end,
    remainingListings: pack.features?.maxListings || 0,
    remainingFeatured: pack.features?.featured ? 1 : 0,
    remainingBumps: pack.features?.boostDays || 0,
    status: 'active'
  }).save();
}

export const adminListTransactions = async (_req: AuthRequest, res: Response) => {
  const data = await Transaction.find().sort({ createdAt: -1 }).lean();
  res.json({ data });
};

export const adminMarkPaid = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as any;
  const tx = await Transaction.findById(id);
  if (!tx) return res.status(404).json({ message: 'Not found' });
  tx.status = 'paid';
  await tx.save();
  const order = await Order.findById(tx.orderId);
  if (order && order.status !== 'paid') {
    order.status = 'paid';
    await order.save();
    await activate(order._id);
  }
  res.json({ ok: true });
};
