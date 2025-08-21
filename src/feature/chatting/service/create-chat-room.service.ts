import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { ChattingModel } from '../chatting.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class CreateChatRoomService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chattingModel: ChattingModel,
  ) {}

  async createChatRoom(
    roomid: string,
    roomname: string,
    userpkey: number,
    frienduserpkeylist: number[],
  ): Promise<{ chatroompkey: number }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();
      await connection.beginTransaction();

      // 채팅방 생성
      const chatroom = await this.chattingModel.createChatRoom(
        connection,
        roomid,
        roomname,
      );
      const chatroompkey = chatroom.insertId;

      // 채팅방 참가자 생성
      await this.chattingModel.createChatRoomParticipants(
        connection,
        chatroompkey,
        userpkey,
      );

      for (const frienduserpkey of frienduserpkeylist) {
        await this.chattingModel.createChatRoomParticipants(
          connection,
          chatroompkey,
          frienduserpkey,
        );
      }

      // 처음 채팅방 메세지 생성
      await this.chattingModel.createChatMessage(
        connection,
        chatroompkey,
        userpkey,
        '새로운 채팅방이 생성되었습니다.',
      );

      await connection.commit();

      return { chatroompkey: chatroompkey };
    } catch (err) {
      await connection?.rollback();
      throw err;
    } finally {
      connection?.release();
    }
  }
}
