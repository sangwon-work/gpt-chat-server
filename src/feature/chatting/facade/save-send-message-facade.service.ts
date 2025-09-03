import { Injectable } from '@nestjs/common';
import { GetChattingRoomService } from '../service/get-chatting-room.service';
import { CreateMessageService } from '../service/create-message.service';

@Injectable()
export class SaveSendMessageFacadeService {
  constructor(
    private readonly getChattingRoomService: GetChattingRoomService,
    private readonly createMessageService: CreateMessageService,
  ) {}

  async saveMessage(userpkey: number, roomid: string, message: string) {
    try {
      // 채팅방 조회
      const { chatroom } =
        await this.getChattingRoomService.getChattingRoom(roomid);

      // 메세지 저장
      await this.createMessageService.createMessage(
        chatroom.chatroompkey,
        userpkey,
        message,
      );
    } catch (err) {
      throw err;
    }
  }
}
