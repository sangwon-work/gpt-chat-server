import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { FriendModel } from '../friend.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetFriendListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly friendModel: FriendModel,
  ) {}

  async getList(userpkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const friendset = await this.friendModel.getFriendList(
        connection,
        userpkey,
      );

      return { friendset: friendset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
