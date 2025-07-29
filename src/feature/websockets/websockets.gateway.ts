import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebSocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  async handleConnection(client: Socket) {
    // 클라이언트 연결 시 처리
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    // 클라이언트 연결 종료 시 처리
    console.log(`Client disconnected: ${client.id}`);
  }

  // 클라이언트가 보낸 메세지 처리
  @SubscribeMessage('chat')
  handleMessage(client: Socket, payload: { roomId: string; message: string }) {
    // 클라이언트로부터 메시지 수신 처리
    console.log('Received: ', payload);

    // 특정 채팅방에 메세지 전송
    this.server.to(payload.roomId).emit('message', {
      sender: client.id,
      message: payload.message,
    });
  }

  // 채팅방 입장
  @SubscribeMessage('join')
  handleJoin(client: Socket, roomId: string) {
    client.join(roomId);
    client.emit('joined', roomId);
  }
}
