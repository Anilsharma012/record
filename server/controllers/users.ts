import { Request, Response } from 'express';
import { User } from '../models/User';
import { adminUserUpdateSchema } from '@shared/schema';

export const adminListUsers = async (req: Request, res: Response) => {
  const { role, q, search, verified } = req.query as any;
  const filter: any = {};
  if (role && role !== 'all') filter.role = role;
  const queryText = q || search;
  if (queryText) {
    filter.$or = [
      { name: { $regex: String(queryText), $options: 'i' } },
      { email: { $regex: String(queryText), $options: 'i' } }
    ];
  }
  if (verified === 'true' || verified === 'false') {
    filter.isVerified = verified === 'true';
  }
  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.json({ ok: true, data: users });
};

export const adminUpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = adminUserUpdateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    res.json({ ok: true, data: user });
  } catch (e: any) {
    res.status(400).json({ ok: false, message: e.message });
  }
};
