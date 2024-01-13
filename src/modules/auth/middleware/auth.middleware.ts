// auth.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
// import { UserCredentials } from 'src/shared/interface/user-credentials.interface';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token fudido' }), this.logger.debug(`Token fudido: ${req.headers.authorization}`);
      
    }
   
    const token = authorizationHeader.split(' ')[1];
  
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
      this.logger.debug(`putz: ${user}`);
  
      if (err || !user) {
        return res.status(401).json({ message: 'Não autorizado' }), this.logger.debug(`Não autorizado: ${req.headers.authorization}`);
      }
  
      req.user = user;
      next();
    })(req, res, next);
  }
}
