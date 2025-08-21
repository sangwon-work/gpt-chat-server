import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { UserModel } from '../user.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userModel: UserModel,
  ) {}

  async createUser(
    phone: string,
    password: string,
    nickname: string,
  ): Promise<{ userpkey: any }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const user = await this.userModel.createUser(
        connection,
        phone,
        password,
        nickname,
      );

      return { userpkey: user.insertId };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
