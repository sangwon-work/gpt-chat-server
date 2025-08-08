import { Injectable } from '@nestjs/common';
import { FriendAcceptDto } from '../dto/friend-accept.dto';
import { GetUserByPkeyService } from '../../user/service/get-user-by-pkey.service';
import { FriendAcceptService } from '../service/friend-accept.service';

@Injectable()
export class FriendAcceptFacadeService {
  constructor(
    private readonly getUserByPkeyService: GetUserByPkeyService,
    private readonly friendAcceptService: FriendAcceptService,
  ) {}

  async acceptFriend(userpkey: number, friendAcceptDto: FriendAcceptDto) {
    try {
      // 요청할 회원 조회
      const { userset } = await this.getUserByPkeyService.getUser(
        friendAcceptDto.userpkey,
      );

      if (userset.length === 1) {
        const user = userset[0];
        // 친구 요청 수락
        await this.friendAcceptService.acceptFriend(userpkey, user.userpkey);
        return { rescode: '0000' };
      } else {
        return { rescode: '0002' };
      }
    } catch (err) {
      throw err;
    }
  }
}
