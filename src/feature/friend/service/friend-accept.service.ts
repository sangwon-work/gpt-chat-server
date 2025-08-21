import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { FriendModel } from '../friend.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class FriendAcceptService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly friendModel: FriendModel,
  ) {}

  async acceptFriend(userpkey: number, requestusetpkey: number): Promise<void> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      await this.friendModel.getFriendAccept(
        connection,
        userpkey,
        requestusetpkey,
      );
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
