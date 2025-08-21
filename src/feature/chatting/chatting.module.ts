import { Module } from '@nestjs/common';
import { ChattingModel } from './chatting.model';
import { ChattingController } from './chatting.controller';
import { ChatRoomListFacadeService } from './facade/chat-room-list-facade.service';
import { ChatRoomListService } from './service/chat-room-list.service';
import { GetLastMessageService } from './service/get-last-message.service';
import { ChatRoomIdDuplicateCheckService } from './service/chat-room-id-duplicate-check.service';
import { CreateChatRoomService } from './service/create-chat-room.service';
import { CreateChatRoomFacadeService } from './facade/create-chat-room-facade.service';
import { GetChattingRoomService } from './service/get-chatting-room.service';
import { CreateMessageService } from './service/create-message.service';
import { SaveSendMessageFacadeService } from './facade/save-send-message-facade.service';
// eslint-disable-next-line max-len
import { GetChattingRoomMessageFacadeService } from './facade/get-chatting-room-message-facade.service';
import { GetChatRoomMessageListService } from './service/get-chat-room-message-list.service';
import { UserModule } from '../user/user.module';
// eslint-disable-next-line max-len
import { CreateOneToOneChatRoomFacadeService } from './facade/create-one-to-one-chat-room-facade.service';

@Module({
  imports: [UserModule],
  controllers: [ChattingController],
  providers: [
    ChattingModel,
    ChatRoomListFacadeService,
    ChatRoomListService,
    GetLastMessageService,
    ChatRoomIdDuplicateCheckService,
    CreateChatRoomService,
    CreateChatRoomFacadeService,
    GetChattingRoomService,
    CreateMessageService,
    SaveSendMessageFacadeService,
    GetChattingRoomMessageFacadeService,
    GetChatRoomMessageListService,
    CreateOneToOneChatRoomFacadeService,
  ],
  exports: [
    ChattingModel,
    GetChattingRoomService,
    CreateMessageService,
    SaveSendMessageFacadeService,
    GetChattingRoomMessageFacadeService,
  ],
})
export class ChattingModule {}
