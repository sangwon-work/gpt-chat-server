import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketJwtMiddleware } from './middleware/socket-jwt.middleware';
import { SaveSendMessageFacadeService } from '../chatting/facade/save-send-message-facade.service';
// eslint-disable-next-line max-len
import { GetChattingRoomMessageFacadeService } from '../chatting/facade/get-chatting-room-message-facade.service';

@WebSocketGateway({
  cors: { origin: '*' },
  pingInterval: 25000,
  pingTimeout: 60000,
}) // 게이트웨이 설정
export class WebSocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() // 웹소켓 인스턴스 생성
  server: Server;

  constructor(
    private readonly jwtMiddleware: SocketJwtMiddleware,
    private readonly saveSendMessageFacadeService: SaveSendMessageFacadeService,
    private readonly getChattingRoomMessageFacadeService: GetChattingRoomMessageFacadeService,
  ) {}

  afterInit(server: Server) {
    server.use(this.jwtMiddleware.handle.bind(this.jwtMiddleware));
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
  // 해당 이벤트 구
  @SubscribeMessage('chat')
  async handleMessage(
    client: Socket,
    payload: { roomId: string; message: string },
  ) {
    // 클라이언트로부터 메시지 수신 처리

    const user = client.data.user; // 👈 미들웨어에서 붙인 유저 정보

    try {
      // 메세지 저장 (Facade 패턴)
      await this.saveSendMessageFacadeService.saveMessage(
        user.userpkey,
        payload.roomId,
        payload.message,
      );
    } catch (err) {
      console.log(err);
    }

    console.log('payload : ', payload);

    // 특정 채팅방에 메세지 전송
    this.server.to(payload.roomId).emit('message', {
      userpkey: user.userpkey,
      sender: user.nickname,
      message: payload.message,
      sendat: new Date().toISOString(),
    });
  }

  // 채팅방 입장
  @SubscribeMessage('join')
  async handleJoin(client: Socket, roomId: string) {
    client.join(roomId);
    const user = client.data.user; // 👈 미들웨어에서 붙인 유저 정보
    // 채팅 대화 목록 조회
    const { roomname, messages } =
      await this.getChattingRoomMessageFacadeService.getMessages(
        roomId,
        user.userpkey,
      );
    client.emit('joined', {
      roomId: roomId,
      roomname: roomname,
      messagelist: messages,
    });
  }

  @SubscribeMessage('pingCheck')
  handlePingCheck(client: Socket) {
    console.log(`📡 Ping received from: ${client.id}`);
    client.emit('pongCheck'); // 응답 원할 경우
  }
}
