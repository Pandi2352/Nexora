// Extra properties attached to the Express request by Nexora middleware.
declare global {
  namespace Express {
    interface Request {
      /** Correlation ID set by requestIdMiddleware. */
      requestId?: string;
      /** Authenticated user attached by JwtAuthGuard. */
      user?: {
        sub: string;
        email: string;
        isPlatformAdmin: boolean;
        sessionId: string;
      };
    }
  }
}

export {};
