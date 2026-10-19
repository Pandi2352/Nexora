import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Token hashing for refresh tokens, invitation and reset links: store only the hash.
 * Password hashing (Argon2id) is added here in MVP 1 together with its package.
 */
export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

/** Cryptographically random URL-safe token. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

/** Constant-time comparison of two hex digests. */
export function safeEqualHex(a: string, b: string): boolean {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

export const HashUtil = { sha256, randomToken, safeEqualHex };
