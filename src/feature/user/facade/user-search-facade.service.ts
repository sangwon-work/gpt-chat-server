import { Injectable } from '@nestjs/common';
import { UserSearchDto } from '../dto/user-search.dto';
import { GetUserSearchListService } from '../service/get-user-search-list.service';

@Injectable()
export class UserSearchFacadeService {
  constructor(
    private readonly getUserSearchListService: GetUserSearchListService,
  ) {}

  async searchFriend(userSearchDto: UserSearchDto, userpkey: number) {
    try {
      const { userlist } = await this.getUserSearchListService.getList(
        userSearchDto.search,
        userpkey,
      );

      return { userlist: userlist };
    } catch (err) {
      throw err;
    }
  }
}
