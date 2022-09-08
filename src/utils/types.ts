import { Request as HttpRequest } from 'express';

interface UserJwtPayload {
  id: number;
}

export type AuthRequest = HttpRequest & { user: UserJwtPayload };
