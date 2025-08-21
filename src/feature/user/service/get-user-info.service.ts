import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { UserModel } from '../user.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetUserInfoService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userModel: UserModel,
  ) {}

  async getUserInfo(userpkey: number) {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.databaseService.getDBConnection();

      const userset = await this.userModel.getUserInfo(connection, userpkey);

      return { user: userset[0] };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
