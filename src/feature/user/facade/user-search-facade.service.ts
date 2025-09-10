import { Injectable } from '@nestjs/common';
import { UserSearchDto } from '../dto/user-search.dto';
import { GetUserSearchListService } from '../service/get-user-search-list.service';
import { GetFriendListService } from '../../friend/service/get-friend-list.service';
import { UserSearchVo } from '../vo/user-search.vo';

@Injectable()
export class UserSearchFacadeService {
  constructor(
    private readonly getUserSearchListService: GetUserSearchListService,
    private readonly getFriendListService: GetFriendListService,
  ) {}

  /**
   * 친구 추가 검색시 회원 조회
   * 기존 친구는 제외
   * @param userSearchDto
   * @param userpkey
   */
  async searchFriend(userSearchDto: UserSearchDto, userpkey: number) {
    try {
      const { userlist } = await this.getUserSearchListService.getList(
        userSearchDto.search,
        userpkey,
      );

      // 친구 조회
      const { friendset } = await this.getFriendListService.getList(userpkey);

      // 검색한 친구가 기존 친구인지 체크
      const resultuserlist: UserSearchVo[] = [];
      for (const user of userlist) {
        const filterusers = friendset.filter((friend) => {
          return user.userpkey === friend.frienduserpkey;
        });
        if (filterusers.length === 0) {
          resultuserlist.push(user);
        }
      }

      return { userlist: resultuserlist };
    } catch (err) {
      throw err;
    }
  }
}
