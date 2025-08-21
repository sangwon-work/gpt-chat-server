import { Injectable } from '@nestjs/common';
import { FriendRequestDto } from '../dto/friend-request.dto';
import { GetUserByPkeyService } from '../../user/service/get-user-by-pkey.service';
import { FriendRequestService } from '../service/friend-request.service';

@Injectable()
export class FriendRequestFacadeService {
  constructor(
    private readonly getUserByPkeyService: GetUserByPkeyService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  async friendRequest(
    userpkey: number,
    friendRequestDto: FriendRequestDto,
  ): Promise<{ rescode: string }> {
    try {
      // 요청할 회원 조회
      const { userset } = await this.getUserByPkeyService.getUser(
        friendRequestDto.userpkey,
      );

      if (userset.length === 1) {
        const user = userset[0];
        // 친구 요청 추가
        await this.friendRequestService.requestFriend(userpkey, user.userpkey);
        return { rescode: '0000' };
      } else {
        return { rescode: '0002' };
      }
    } catch (err) {
      throw err;
    }
  }
}
