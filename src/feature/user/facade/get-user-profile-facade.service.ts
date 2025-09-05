import { Injectable } from '@nestjs/common';
import { GetUserInfoService } from '../service/get-user-info.service';
import { UserVo } from '../vo/user.vo';

@Injectable()
export class GetUserProfileFacadeService {
  constructor(private readonly getUserInfoService: GetUserInfoService) {}

  async getUserProfile(userpkey: number): Promise<{ user: UserVo }> {
    try {
      const { user } = await this.getUserInfoService.getUserInfo(userpkey);
      return { user: user };
    } catch (err) {
      throw err;
    }
  }
}
