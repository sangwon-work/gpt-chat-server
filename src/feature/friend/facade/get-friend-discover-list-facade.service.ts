import { Injectable } from '@nestjs/common';
import { GetFriendDiscoverListService } from '../service/get-friend-discover-list.service';

@Injectable()
export class GetFriendDiscoverListFacadeService {
  constructor(
    private readonly getFriendDiscoverListService: GetFriendDiscoverListService,
  ) {}

  async getFriendDiscoverList(userpkey: number) {
    try {
      // 친구 요청된 목록 조회
      const { userset } =
        await this.getFriendDiscoverListService.getList(userpkey);

      return { userlist: userset };
    } catch (err) {
      throw err;
    }
  }
}
