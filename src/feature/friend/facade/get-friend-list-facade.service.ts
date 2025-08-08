import { Injectable } from '@nestjs/common';
import { GetFriendListService } from '../service/get-friend-list.service';

@Injectable()
export class GetFriendListFacadeService {
  constructor(private readonly getFriendListService: GetFriendListService) {}

  async getFriendList(
    userpkey: number,
  ): Promise<{ friendcount: number; friendlist: any[] }> {
    try {
      const { friendset } = await this.getFriendListService.getList(userpkey);

      return { friendcount: friendset.length, friendlist: friendset };
    } catch (err) {
      throw err;
    }
  }
}
