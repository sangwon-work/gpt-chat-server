import {
  Controller,
  Request,
  Req,
  Response,
  Res,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseService } from '../../shared/response/response.service';
import { GetUserInfoFacadeService } from './facade/get-user-info-facade.service';
import { UserSearchDto } from './dto/user-search.dto';
import { UserSearchFacadeService } from './facade/user-search-facade.service';
import { GetUserProfileFacadeService } from './facade/get-user-profile-facade.service';
import { UserProfileDto } from './dto/user-profile.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly getUserInfoFacadeService: GetUserInfoFacadeService,
    private readonly userSearchFacadeService: UserSearchFacadeService,
    private readonly getUserProfileFacadeService: GetUserProfileFacadeService,
  ) {}

  @Get('info')
  @UseGuards(AuthGuard('access'))
  async getUserInfo(@Req() req: Request, @Res() res: Response) {
    try {
      const { userpkey } = req['user'];
      const { user } =
        await this.getUserInfoFacadeService.getUserInfo(userpkey);
      return this.responseService.response(
        res,
        200,
        '0000',
        {},
        { user: user },
      );
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 친구 찾기
  @Get('/search')
  @UseGuards(AuthGuard('access'))
  async getFriendSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query() userSearchDto: UserSearchDto,
  ) {
    try {
      const { userpkey } = req['user'];
      const { userlist } = await this.userSearchFacadeService.searchFriend(
        userSearchDto,
        userpkey,
      );
      return this.responseService.response(
        res,
        200,
        '0000',
        {},
        { userlist: userlist },
      );
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  @Get('/profile')
  @UseGuards(AuthGuard('access'))
  async getUserProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Query() userProfileDto: UserProfileDto,
  ) {
    try {
      const { user } = await this.getUserProfileFacadeService.getUserProfile(
        userProfileDto.userpkey,
      );
      return this.responseService.response(
        res,
        200,
        '0000',
        {},
        { user: user },
      );
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }
}
