import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  userId: string;
}

interface JoinRoomDto {
  room: string;
}

interface ChatMessageDto {
  room: string;
  message: string;
}

@Injectable()
@WebSocketGateway({
  namespace: '/chat',
  path: '/chat-socket',
  cors: {
    origin: process.env.APP_ORIGIN,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  private userColors = new Map<string, string>();
  private colors = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
  ];

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    const rawCookie = client.handshake.headers.cookie;
    if (!rawCookie) {
      this.logger.warn(
        `Client connected without any cookies (socketId=${client.id})`,
      );
      client.disconnect(true);
      return;
    }

    const parsed = cookie.parse(rawCookie);
    const token = parsed.accessToken;
    if (!token) {
      this.logger.warn(
        `Client connected without accessToken cookie (socketId=${client.id})`,
      );
      client.disconnect(true);
      return;
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    } catch {
      this.logger.warn(
        `Client connected with invalid/expired token (socketId=${client.id})`,
      );
      client.disconnect(true);
      return;
    }

    client.data.user = { id: payload.userId };

    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.userColors.set(payload.userId, color);

    this.logger.log(
      `Client connected: userId=${payload.userId}, socketId=${client.id}`,
    );
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as { id: string } | undefined;
    if (user?.id) {
      this.userColors.delete(user.id);
      this.logger.log(
        `Client disconnected: userId=${user.id}, socketId=${client.id}`,
      );
    } else {
      this.logger.log(
        `Client disconnected without user data: socketId=${client.id}`,
      );
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoin(client: Socket, dto: JoinRoomDto) {
    const user = client.data.user as { id: string };
    if (!user?.id) {
      client.emit('error', 'Not authenticated');
      client.disconnect(true);
      return;
    }

    client.join(dto.room);

    const color = this.userColors.get(user.id)!;
    const profile = await this.usersService.findById(user.id);
    this.server.to(dto.room).emit('userJoined', {
      userId: user.id,
      color,
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
    });
  }

  @SubscribeMessage('leaveRoom')
  handleLeave(client: Socket, dto: JoinRoomDto) {
    const user = client.data.user as { id: string };
    if (!user?.id) return;

    client.leave(dto.room);
    this.server.to(dto.room).emit('userLeft', { userId: user.id });
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, dto: ChatMessageDto) {
    const user = client.data.user as { id: string };
    if (!user?.id) {
      client.emit('error', 'Not authenticated');
      return;
    }

    const color = this.userColors.get(user.id) || '#000000';
    const payload = {
      room: dto.room,
      userId: user.id,
      message: dto.message,
      color,
      timestamp: new Date().toISOString(),
    };

    this.server.to(dto.room).emit('message', payload);
  }
}
