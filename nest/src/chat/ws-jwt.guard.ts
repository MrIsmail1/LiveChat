import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const client: Socket = ctx.switchToWs().getClient<Socket>();

    const rawCookie = client.handshake.headers.cookie;
    if (!rawCookie) {
      throw new UnauthorizedException('No cookies sent');
    }

    const cookies = cookie.parse(rawCookie);
    const token = cookies.accessToken;
    if (!token) {
      throw new UnauthorizedException('No access token cookie');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      client.data.user = { id: (payload as any).userId };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
