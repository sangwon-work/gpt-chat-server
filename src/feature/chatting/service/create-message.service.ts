import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { ChattingModel } from '../chatting.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class CreateMessageService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chattingModel: ChattingModel,
  ) {}

  async createMessage(chatroompkey: number, userpkey: number, message: string) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      await this.chattingModel.createChatMessage(
        connection,
        chatroompkey,
        userpkey,
        message,
      );

      // 채팅방 수정 시간 업데이트
      await this.chattingModel.updateChatRoomUpdateAt(connection, chatroompkey);
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
