import { Module } from '@nestjs/common';
import { WebSocketsModule } from './websockets/websockets.module';
import { UserModule } from './user/user.module';
import { ChattingModule } from './chatting/chatting.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [WebSocketsModule, UserModule, ChattingModule, FriendModule],
})
export class FeatureModule {}
