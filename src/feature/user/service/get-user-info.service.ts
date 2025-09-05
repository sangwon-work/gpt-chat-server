import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { UserModel } from '../user.model';
import { PoolConnection } from 'mysql2/promise';
import { UserVo } from '../vo/user.vo';

@Injectable()
export class GetUserInfoService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userModel: UserModel,
  ) {}

  async getUserInfo(userpkey: number): Promise<{ user: UserVo }> {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.databaseService.getDBConnection();

      const userset: UserVo[] = await this.userModel.getUserInfo(
        connection,
        userpkey,
      );

      return { user: userset[0] };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
