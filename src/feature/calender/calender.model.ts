import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class CalenderModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 내 캘린더 목록 조회
   * @param connection
   * @param userpkey
   */
  async getCalenderList(connection: PoolConnection, userpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            calenderpkey,
            title,
            memo,
            regdate
        from calender 
        where userpkey=?;
      `,
      [userpkey],
    );
  }

  /**
   * 공유된 캘린더 목록 조회
   * @param connection
   * @param userpkey
   */
  async getShareCalenderList(connection: PoolConnection, userpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            c.calenderpkey,
            c.title,
            c.memo,
            c.regdate
        from calendershare cs
        join calender c on cs.calenderpkey=c.calenderpkey
        where cs.userpkey=?;
      `,
      [userpkey],
    );
  }
}
