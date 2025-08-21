import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { UserModel } from '../user.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetUserByPkeyService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userModel: UserModel,
  ) {}

  async getUser(userpkey: number) {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.databaseService.getDBConnection();

      const userset = await this.userModel.getUserByPkey(connection, userpkey);

      return { userset: userset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
