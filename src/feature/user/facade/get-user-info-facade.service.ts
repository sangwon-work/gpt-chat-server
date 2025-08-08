import { Injectable } from '@nestjs/common';
import { GetUserInfoService } from '../service/get-user-info.service';

@Injectable()
export class GetUserInfoFacadeService {
  constructor(private readonly getUserInfoService: GetUserInfoService) {}

  async getUserInfo(userpkey: number) {
    try {
      const { user } = await this.getUserInfoService.getUserInfo(userpkey);

      return { user: user };
    } catch (err) {
      throw err;
    }
  }
}
