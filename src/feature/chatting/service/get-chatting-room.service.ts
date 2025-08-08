import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { ChattingModel } from '../chatting.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetChattingRoomService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chattingModel: ChattingModel,
  ) {}

  async getChattingRoom(roomid: string): Promise<{ chatroom: any }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      // 채팅방 조회
      const chatroomset = await this.chattingModel.getChatRoomByRoomId(
        connection,
        roomid,
      );

      return { chatroom: chatroomset[0] };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
