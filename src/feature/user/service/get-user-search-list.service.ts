import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { UserModel } from '../user.model';
import { UserSearchVo } from '../vo/user-search.vo';

@Injectable()
export class GetUserSearchListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userModel: UserModel,
  ) {}

  /**
   * 친구 추가 검색시 회원 조회
   * @param search
   * @param userpkey
   */
  async getList(
    search: string,
    userpkey: number,
  ): Promise<{ userlist: UserSearchVo[] }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const userset: UserSearchVo[] = await this.userModel.getUserSearch(
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
