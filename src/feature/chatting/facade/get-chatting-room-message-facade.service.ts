import { Injectable } from '@nestjs/common';
import { GetChattingRoomService } from '../service/get-chatting-room.service';
import { GetChatRoomMessageListService } from '../service/get-chat-room-message-list.service';

@Injectable()
export class GetChattingRoomMessageFacadeService {
  constructor(
    private readonly getChattingRoomService: GetChattingRoomService,
    private readonly getChatRoomMessageListService: GetChatRoomMessageListService,
  ) {}

  async getMessages(
    roomId: string,
    userpkey: number,
  ): Promise<{
    roomname: string;
    messages: { sender: string; message: string; sendat: string }[];
  }> {
    try {
      // 채팅방 조회
      const { chatroom } =
        await this.getChattingRoomService.getChattingRoom(roomId);

      // 채팅방 메세지 목록 조회
      const { messagelist } =
        await this.getChatRoomMessageListService.getMessageList(
          chatroom.chatroompkey,
          userpkey,
        );
      return { roomname: chatroom.roomname, messages: messagelist };
    } catch (err) {
      throw err;
    }
  }
}
