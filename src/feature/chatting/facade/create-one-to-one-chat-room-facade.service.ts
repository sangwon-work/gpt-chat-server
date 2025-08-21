import { Injectable } from '@nestjs/common';
import { CreateOneToOneChatRoomDto } from '../dto/create-one-to-one-chat-room.dto';
import { GetUserByPkeyService } from '../../user/service/get-user-by-pkey.service';
import { ChatRoomIdDuplicateCheckService } from '../service/chat-room-id-duplicate-check.service';
import { CreateChatRoomService } from '../service/create-chat-room.service';

@Injectable()
export class CreateOneToOneChatRoomFacadeService {
  constructor(
    private readonly getUserByPkeyService: GetUserByPkeyService,
    private readonly chatRoomIdDuplicateCheckService: ChatRoomIdDuplicateCheckService,
    private readonly createChatRoomService: CreateChatRoomService,
  ) {}

  async createOneToOneChatRoom(
    userpkey: number,
    createOneToOneChatRoomDto: CreateOneToOneChatRoomDto,
  ): Promise<{
    rescode: string;
    body: { roomid: string; chatroompkey: number };
  }> {
    try {
      // 채팅 상태 조회
      const { userset } = await this.getUserByPkeyService.getUser(
        createOneToOneChatRoomDto.userpkey,
      );

      if (userset.length === 1) {
        const user = userset[0];
        // 채팅방 생성
        // roomid 생성 uuid4(중복체크 필수)
        const roomid: string =
          await this.chatRoomIdDuplicateCheckService.getRoomId();

        const { chatroompkey } =
          await this.createChatRoomService.createChatRoom(
            roomid,
            user.nickname,
            userpkey,
            [user.userpkey],
          );
        return { rescode: '0000', body: { roomid, chatroompkey } };
      } else {
        return { rescode: '0002', body: null };
      }
    } catch (err) {
      throw err;
    }
  }
}
