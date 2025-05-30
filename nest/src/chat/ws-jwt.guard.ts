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

  async canActivate(ctx: ExecutionContext) {
    const client: Socket = ctx.switchToWs().getClient<Socket>();

    const rawCookie = client.handshake.headers.cookie;
    if (!rawCookie) {
      throw new UnauthorizedException('No cookies sent');
    }

    const cookies = cookie.parse(rawCookie);

    const token = cookies.accessToken;
    if (!token) {
      throw new UnauthorizedException('No access token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ userId: string }>(
        token,
        {
          secret: process.env.JWT_ACCESS_SECRET,
        },
      );

      (client as any).user = { id: payload.userId };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
