import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { ChattingModel } from '../chatting.model';
import { PoolConnection } from 'mysql2/promise';
import { ChatRoomListVo } from '../vo/chat-room-list.vo';

@Injectable()
export class ChatRoomListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chattingModel: ChattingModel,
  ) {}

  async getRoomList(
    userpkey: number,
  ): Promise<{ chatroomset: ChatRoomListVo[] }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const chatroomset: ChatRoomListVo[] =
        await this.chattingModel.getChatRoomList(connection, userpkey);

      return { chatroomset: chatroomset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
