import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    // Adicione verificações de token personalizadas, se necessário
    const token = this.extractJwtFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token JWT ausente');
    }

    // Você pode validar o token ou verificar sua lista negra aqui, se necessário

    return super.canActivate(context);
  }

  private extractJwtFromRequest(request: Request): string | null {
    if (!request.headers.authorization) {
      return null;
    }

    const parts = request.headers.authorization.split(' ');

    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null;
    }

    return parts[1];
  }
}
