export interface JwtPayload {
  sub: string; // userId (UUID v4)
  email: string;
  isPlatformAdmin: boolean;
  sessionId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  isPlatformAdmin: boolean;
  avatarUrl?: string;
  timezone: string;
  locale: string;
}
