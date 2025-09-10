import { forwardRef, Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendModel } from './friend.model';
import { GetFriendListFacadeService } from './facade/get-friend-list-facade.service';
import { FriendRequestFacadeService } from './facade/friend-request-facade.service';
import { FriendAcceptFacadeService } from './facade/friend-accept-facade.service';
import { GetFriendListService } from './service/get-friend-list.service';
import { UserModule } from '../user/user.module';
import { FriendRequestService } from './service/friend-request.service';
// eslint-disable-next-line max-len
import { GetFriendDiscoverListFacadeService } from './facade/get-friend-discover-list-facade.service';
import { GetFriendDiscoverListService } from './service/get-friend-discover-list.service';
import { FriendAcceptService } from './service/friend-accept.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [FriendController],
  providers: [
    FriendModel,
    GetFriendListFacadeService,
    FriendRequestFacadeService,
    FriendAcceptFacadeService,
    GetFriendListService,
    FriendRequestService,
    GetFriendDiscoverListFacadeService,
    GetFriendDiscoverListService,
    FriendAcceptService,
  ],
  exports: [GetFriendListService],
})
export class FriendModule {}
