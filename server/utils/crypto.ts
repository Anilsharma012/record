import crypto from 'crypto';

const DEFAULT_ALGO = 'aes-256-gcm';

function getKey() {
  const key = process.env.SECRETS_KEY || process.env.SECRET_KEY || '';
  if (!key) return null;
  // Ensure 32 bytes
  return crypto.createHash('sha256').update(key).digest();
}

export function encryptJSON(obj: Record<string, any>): { iv: string; tag: string; data: string } | { data: string } {
  const key = getKey();
  const plaintext = JSON.stringify(obj);
  if (!key) return { data: Buffer.from(plaintext, 'utf8').toString('base64') };
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(DEFAULT_ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64'),
  };
}

export function decryptJSON(payload: any): Record<string, any> {
  const key = getKey();
  try {
    if (!key) {
      const text = Buffer.from(payload?.data || '', 'base64').toString('utf8');
      return JSON.parse(text || '{}');
    }
    const iv = Buffer.from(payload.iv, 'base64');
    const tag = Buffer.from(payload.tag, 'base64');
    const encrypted = Buffer.from(payload.data, 'base64');
    const decipher = crypto.createDecipheriv(DEFAULT_ALGO, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    return JSON.parse(decrypted || '{}');
  } catch {
    return {};
  }
}
