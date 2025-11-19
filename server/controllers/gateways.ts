import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Gateway } from '../models/Gateway';
import { encryptJSON, decryptJSON } from '../utils/crypto';

function mask(val?: string) {
  if (!val) return '';
  if (val.length <= 4) return '*'.repeat(val.length);
  return val.slice(0, 2) + '***' + val.slice(-2);
}

export const adminListGateways = async (_req: AuthRequest, res: Response) => {
  const list = await Gateway.find().sort({ createdAt: -1 });
  const data = list.map((g: any) => {
    const creds = decryptJSON(g.credentials || {});
    return {
      _id: g._id,
      provider: g.provider,
      name: g.name,
      enabled: g.enabled,
      isDefault: g.isDefault,
      public: g.public || {},
      credentialsPreview: Object.fromEntries(Object.entries(creds).map(([k, v]) => [k, typeof v === 'string' ? mask(v as string) : '***']))
    };
  });
  res.json({ data });
};

export const createGateway = async (req: AuthRequest, res: Response) => {
  const { provider, name, enabled, isDefault, credentials, pub } = req.body as any;
  const gw = new Gateway({ provider, name, enabled, isDefault, credentials: encryptJSON(credentials || {}), public: pub || {} });
  if (isDefault) await Gateway.updateMany({ provider }, { $set: { isDefault: false } });
  await gw.save();
  res.json({ ok: true, id: gw._id });
};

export const updateGateway = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as any;
  const { provider, name, enabled, isDefault, credentials, pub } = req.body as any;
  const update: any = { provider, name, enabled, public: pub };
  if (credentials) update.credentials = encryptJSON(credentials);
  if (typeof isDefault === 'boolean') update.isDefault = isDefault;
  if (isDefault) await Gateway.updateMany({ provider }, { $set: { isDefault: false } });
  await Gateway.findByIdAndUpdate(id, update);
  res.json({ ok: true });
};

export const deleteGateway = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as any;
  await Gateway.findByIdAndDelete(id);
  res.json({ ok: true });
};

export async function getGatewayCreds(provider: string) {
  const gw = await Gateway.findOne({ provider, enabled: true }).sort({ isDefault: -1, updatedAt: -1 });
  if (!gw) return { creds: null, pub: null };
  const creds = decryptJSON(gw.credentials || {});
  return { creds, pub: gw.public || {} };
}

export const publicGateways = async (_req: AuthRequest, res: Response) => {
  const list = await Gateway.find({ enabled: true });
  res.json({ data: list.map(g => ({ provider: g.provider, public: g.public })) });
};
