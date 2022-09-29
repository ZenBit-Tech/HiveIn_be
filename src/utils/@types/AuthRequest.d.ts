import { Request } from 'express';
import { Users } from 'src/modules/entities/users.entity';

export interface AuthRequest extends Request {
  user: Users;
}
