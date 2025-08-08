import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class FriendModel {
  constructor(private readonly databaseService: DatabaseService) {}

  async getFriendList(connection: PoolConnection, userpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select
          f.friendpkey,
          case
            when f.requesterpkey = ? then f.receiverpkey
            else f.requesterpkey
          end as frienduserpkey,
          u.nickname as nickname,
          '' as profileimageurl
        from
            friend f
        join
          user u
          on u.userpkey = case
            when f.requesterpkey = ? then f.receiverpkey
            else f.requesterpkey
          end
        where
          (f.requesterpkey = ? or f.receiverpkey = ?)
          and f.status = 'accepted'
        order by u.nickname;
      `,
      [userpkey, userpkey, userpkey, userpkey],
    );
  }

  async createFriendRequest(
    connection: PoolConnection,
    userpkey: number,
    frienduserpkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        insert into friend (requesterpkey, receiverpkey, status, requestedat, respondedat)
        values (?, ?, 'pending', now(), '1999-01-01 00:00:00');
      `,
      [userpkey, frienduserpkey],
    );
  }

  async getFriendDiscoverList(connection: PoolConnection, userpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select
          u.userpkey,
          u.nickname,
          '' as profileimageurl
        from friend f 
        join user u on f.requesterpkey = u.userpkey
        where f.receiverpkey=? and f.status='pending'
      `,
      [userpkey],
    );
  }

  async getFriendAccept(
    connection: PoolConnection,
    userpkey: number,
    requesterpkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      // eslint-disable-next-line max-len
      "update friend set status='accepted', respondedat=now() where requesterpkey=? and receiverpkey=?;",
      [requesterpkey, userpkey],
    );
  }
}
