import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { ChattingModel } from '../chatting.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetChatRoomMessageListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chattingModel: ChattingModel,
  ) {}

  async getMessageList(chatroompkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      // 채팅방 메세지 목록 조회
      const chatmessageset = await this.chattingModel.getChatMessageList(
        connection,
        chatroompkey,
      );

      return { messagelist: chatmessageset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
