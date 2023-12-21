// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { UserCredentials } from 'src/shared/interface/user-credentials.interface';


  declare global {
    namespace Express {
      interface Request {
        UserCredentials?: UserCredentials;
      }
    }
  }

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err: any, UserCredentials: any) => {
      if (err || !UserCredentials) {
        return res.status(401).json({ message: 'Não autorizado' });
      }
      req.UserCredentials = UserCredentials;
      next();
    })(req, res, next);
  }
}
