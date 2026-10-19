import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { hash, verify } from '@node-rs/argon2';

/**
 * Token hashing for refresh tokens, invitation and reset links: store only the hash.
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

/** Hashes a plain-text password using Argon2id. */
export async function hashPassword(plainText: string): Promise<string> {
  return hash(plainText);
}

/** Verifies a plain-text password against an Argon2id hash. */
export async function verifyPassword(plainText: string, digest: string): Promise<boolean> {
  try {
    return await verify(digest, plainText);
  } catch {
    return false;
  }
}

export const HashUtil = { sha256, randomToken, safeEqualHex, hashPassword, verifyPassword };
