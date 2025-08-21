import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { ChatRoomIdDuplicateCheckService } from '../service/chat-room-id-duplicate-check.service';
import { CreateChatRoomService } from '../service/create-chat-room.service';

@Injectable()
export class CreateChatRoomFacadeService {
  constructor(
    private readonly chatRoomIdDuplicateCheckService: ChatRoomIdDuplicateCheckService,
    private readonly createChatRoomService: CreateChatRoomService,
  ) {}

  async createRoom(userpkey: number, createChatRoomDto: CreateChatRoomDto) {
    try {
      // roomid 생성 uuid4(중복체크 필수)
      const roomid: string =
        await this.chatRoomIdDuplicateCheckService.getRoomId();

      const { chatroompkey } = await this.createChatRoomService.createChatRoom(
        roomid,
        createChatRoomDto.roomname,
        userpkey,
        createChatRoomDto.frienduserpkeylist,
      );

      return { roomid, chatroompkey };
    } catch (err) {
      throw err;
    }
  }
}
