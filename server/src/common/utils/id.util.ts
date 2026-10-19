import { randomUUID } from 'node:crypto';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Entity IDs are UUID v4 strings. MongoDB ObjectId is never used.
 * Node's built-in crypto.randomUUID() generates v4, so no extra package is needed.
 */
export function generateUuid(): string {
  return randomUUID();
}

export function isValidUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_V4.test(value);
}

export const IdUtil = { generateUuid, isValidUuid };
