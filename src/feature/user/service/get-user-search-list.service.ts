import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { UserModel } from '../user.model';

@Injectable()
export class GetUserSearchListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userModel: UserModel,
  ) {}

  async getList(search: string, userpkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const userset = await this.userModel.getUserSearch(
        connection,
        search,
        userpkey,
      );

      return { userlist: userset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
