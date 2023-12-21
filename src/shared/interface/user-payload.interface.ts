export interface UserPayload {
    sub: string;
    username: string;
    iat?: number;
    exp?: number;
  }