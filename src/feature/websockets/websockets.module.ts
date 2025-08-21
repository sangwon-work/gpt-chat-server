import { Module } from '@nestjs/common';
import { WebSocketsGateway } from './websockets.gateway';
import { SocketJwtMiddleware } from './middleware/socket-jwt.middleware';
import { ChattingModule } from '../chatting/chatting.module';

@Module({
  imports: [ChattingModule],
  providers: [WebSocketsGateway, SocketJwtMiddleware],
})
export class WebSocketsModule {}
