import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageDto, JoinRoomDto } from './dto/chat.dto';
import { WsJwtGuard } from './ws-jwt.guard';

@WebSocketGateway({
  namespace: '/chat',
  path: '/chat-socket',
  cors: {
    origin: process.env.APP_ORIGIN,
    credentials: true,
  },
})
@Injectable()
@UseGuards(WsJwtGuard)
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

  handleConnection(client: Socket) {
    const user = client.data.user;
    if (!user) {
      this.logger.warn('Client connected without user data');
      client.disconnect();
      return;
    }
    // assign random color
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.userColors.set(user.id, color);
    this.logger.log(`Client connected: ${user.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    this.userColors.delete(user.id);
    this.logger.log(`Client disconnected: ${user.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    client.join(dto.room);
    const user = client.data.user;
    this.server.to(dto.room).emit('userJoined', {
      userId: user.id,
      color: this.userColors.get(user.id),
    });
  }

  @SubscribeMessage('leaveRoom')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    client.leave(dto.room);
    const user = client.data.user;
    this.server.to(dto.room).emit('userLeft', { userId: user.id });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: ChatMessageDto,
  ) {
    const user = client.data.user;
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
