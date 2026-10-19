// Extra properties attached to the Express request by Nexora middleware.
declare global {
  namespace Express {
    interface Request {
      /** Correlation ID set by requestIdMiddleware. */
      requestId?: string;
    }
  }
}

export {};
