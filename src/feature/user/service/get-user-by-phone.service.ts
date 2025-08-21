import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { UserModel } from '../user.model';
import { PoolConnection } from 'mysql2/promise';
import { LoginUserVo } from '../vo/login-user.vo';

@Injectable()
export class GetUserByPhoneService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userModel: UserModel,
  ) {}

  async getUser(phone: string): Promise<{ user: LoginUserVo }> {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.databaseService.getDBConnection();
      const userset: LoginUserVo[] = await this.userModel.getUserByPhone(
        connection,
        phone,
      );

      if (userset.length === 1) {
        return { user: userset[0] };
      } else {
        return { user: null };
      }
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
