import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class UserModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 핸드폰번호 중복체크
   * @param connection
   * @param phone
   */
  async phoneValidation(connection: PoolConnection, phone: string) {
    return await this.databaseService.dbQuery(
      connection,
      'select * from user where phone=?;',
      [phone],
    );
  }

  /**
   * 회원 추가
   * @param connection
   * @param phone
   * @param password
   * @param nickname
   */
  async createUser(
    connection: PoolConnection,
    phone: string,
    password: string,
    nickname: string,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      'insert into user (phone, password, nickname, regdate) values (?, ?, ?, now());',
      [phone, password, nickname],
    );
  }

  /**
   * 핸드폰번호 회원 조회
   * @param connection
   * @param phone
   */
  async getUserByPhone(connection: PoolConnection, phone: string) {
    return await this.databaseService.dbQuery(
      connection,
      'select userpkey, nickname, phone, password, regdate from user where phone=?;',
      [phone],
    );
  }

  async getUserInfo(connection: PoolConnection, userpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      "select nickname, '' as profileimageurl from user where userpkey=?",
      [userpkey],
    );
  }

  async getUserSearch(
    connection: PoolConnection,
    search: string,
    userpkey: number,
  ) {
    const params = [`%${search}%`, userpkey];
    return await this.databaseService.dbQuery(
      connection,
      `
        select userpkey, nickname, phone from user where phone like ? and userpkey != ?;
      `,
      params,
    );
  }

  async getUserByPkey(connection: PoolConnection, userpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      'select userpkey, nickname, phone, password, regdate from user where userpkey=?;',
      [userpkey],
    );
  }
}
