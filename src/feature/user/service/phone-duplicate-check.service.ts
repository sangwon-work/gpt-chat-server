import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { UserModel } from '../user.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class PhoneDuplicateCheckService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userModel: UserModel,
  ) {}

  /**
   * 핸드폰번호 중복체크
   * @param phone
   */
  async isDuplicate(phone: string): Promise<boolean> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const userset = await this.userModel.phoneValidation(connection, phone);
      return userset.length > 0;
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
