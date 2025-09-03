import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class ChattingModel {
  constructor(private readonly databaseService: DatabaseService) {}

  async getChatRoomList(connection: PoolConnection, userpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select * 
        from chatroom cr
        join chatroomparticipants crp on cr.chatroompkey=crp.chatroompkey
        where crp.userpkey=?
        order by cr.updatedat desc;
      `,
      [userpkey],
    );
  }

  async getLastMessage(connection: PoolConnection, chatroompkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select cm.messagetype, cm.message, u.nickname, cm.sendat
        from chatmessage cm
        join user u on cm.userpkey=u.userpkey
        where chatroompkey=? 
        order by sendat desc 
        limit 1;
      `,
      [chatroompkey],
    );
  }

  async getChatRoomByRoomId(connection: PoolConnection, roomid: string) {
    return await this.databaseService.dbQuery(
      connection,
      'select chatroompkey, roomname from chatroom where roomid=?;',
      [roomid],
    );
  }

  async createChatRoom(
    connection: PoolConnection,
    roomid: string,
    roomname: string,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        insert into chatroom (roomid, roomname, roomtype, createdat, updatedat) 
        values (?, ?, 'ONT_TO_ONE', now(), now());
      `,
      [roomid, roomname],
    );
  }

  async createChatRoomParticipants(
    connection: PoolConnection,
    chatroompkey: number,
    userpkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      'insert into chatroomparticipants (chatroompkey, userpkey) values (?, ?)',
      [chatroompkey, userpkey],
    );
  }

  async createChatMessage(
    connection: PoolConnection,
    chatroompkey: number,
    userpkey: number,
    message: string,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        insert into chatmessage (chatroompkey, userpkey, message, messagetype, sendat) 
        values (?, ?, ?, 'text', now())
      `,
      [chatroompkey, userpkey, message],
    );
  }

  async getChatMessageList(connection: PoolConnection, chatroompkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            u.nickname sender,
            cm.message,
            cm.sendat
        from chatmessage cm
        join user u on cm.userpkey=u.userpkey
        where cm.chatroompkey=?
        order by cm.chatmessagepkey;
      `,
      [chatroompkey],
    );
  }

  async updateChatRoomUpdateAt(
    connection: PoolConnection,
    chatroompkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      'update chatroom set updatedat=now() where chatroompkey=?;',
      [chatroompkey],
    );
  }
}
