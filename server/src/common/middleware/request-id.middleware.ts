import type { NextFunction, Request, Response } from 'express';
import { IdUtil } from '../utils/id.util';

export const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Gives every request a correlation ID: reuses a valid incoming `x-request-id`
 * (e.g. from the reverse proxy), otherwise generates one. Echoed in the response header
 * and in error bodies.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header(REQUEST_ID_HEADER);
  req.requestId = incoming && IdUtil.isValidUuid(incoming) ? incoming : IdUtil.generateUuid();
  res.setHeader(REQUEST_ID_HEADER, req.requestId);
  next();
}
