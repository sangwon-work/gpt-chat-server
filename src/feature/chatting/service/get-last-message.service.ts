import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { ChattingModel } from '../chatting.model';
import { PoolConnection } from 'mysql2/promise';
import { LastMessageVo } from '../vo/last-message.vo';

@Injectable()
export class GetLastMessageService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chattingModel: ChattingModel,
  ) {}

  async getMessage(
    chatroompkey: number,
  ): Promise<{ lastmessage: LastMessageVo }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const chatmessageset = await this.chattingModel.getLastMessage(
        connection,
        chatroompkey,
      );

      if (chatmessageset.length > 0) {
        return { lastmessage: chatmessageset[0] };
      } else {
        return { lastmessage: null };
      }
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
