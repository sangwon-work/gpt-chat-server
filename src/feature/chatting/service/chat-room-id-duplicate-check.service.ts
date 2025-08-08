import { Injectable } from '@nestjs/common';
import { ChattingModel } from '../chatting.model';
import { DatabaseService } from '../../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class ChatRoomIdDuplicateCheckService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chattingModel: ChattingModel,
  ) {}

  async getRoomId(): Promise<string> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      let roomid = uuid4();
      while (true) {
        // roomid 중복체크 조회
        const chatroomset = await this.chattingModel.getChatRoomByRoomId(
          connection,
          roomid,
        );
        if (chatroomset.length === 0) {
          break;
        } else {
          roomid = uuid4();
        }
      }
      return roomid;
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
