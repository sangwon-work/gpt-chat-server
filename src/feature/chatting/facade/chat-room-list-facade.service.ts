import { Injectable } from '@nestjs/common';
import { ChatRoomListVo } from '../vo/chat-room-list.vo';
import { ChatRoomListService } from '../service/chat-room-list.service';
import { GetLastMessageService } from '../service/get-last-message.service';

@Injectable()
export class ChatRoomListFacadeService {
  constructor(
    private readonly chatRoomListService: ChatRoomListService,
    private readonly getLastMessageService: GetLastMessageService,
  ) {}

  async getRoomList(userpkey: number): Promise<{ roomlist: ChatRoomListVo[] }> {
    try {
      const { chatroomset } =
        await this.chatRoomListService.getRoomList(userpkey);

      const roomlist = chatroomset.map(async (chatroom: ChatRoomListVo) => {
        // 마지막 메세지 조회
        const { lastmessage } = await this.getLastMessageService.getMessage(
          chatroom.chatroompkey,
        );
        chatroom.lastmessage = lastmessage;
        return chatroom;
      });
      return { roomlist: await Promise.all(roomlist) };
    } catch (err) {
      throw err;
    }
  }
}
