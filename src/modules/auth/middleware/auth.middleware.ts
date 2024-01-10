// auth.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
// import { UserCredentials } from 'src/shared/interface/user-credentials.interface';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug(`Headers: ${req.headers.authorization}`);
    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token fudido' });
    }
   
    const token = authorizationHeader.split(' ')[1];
  
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
      this.logger.debug(`putz: ${user}`);
  
      if (err || !user) {
        return res.status(401).json({ message: 'Não autorizado' });
      }
  
      req.user = user;
      next();
    })(req, res, next);
  }
}
