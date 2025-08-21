// socket-jwt.middleware.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class SocketJwtMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  handle(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      // 유저 정보를 소켓에 붙여서 다음 핸들러에서 사용 가능하게 만듦
      socket.data.user = this.jwtService.verify(token.replace('Bearer ', ''));
      console.log(socket.data.user);
      next();
    } catch (err) {
      console.log(err.message);
      next(new Error('Authentication failed'));
    }
  }
}
