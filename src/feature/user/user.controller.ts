import {
  Controller,
  Post,
  Request,
  Req,
  Response,
  Res,
  Body,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignupDto } from './dto/signup.dto';
import { ResponseService } from '../../shared/response/response.service';
import { SignupFacadeService } from '../auth/facade/signup-facade.service';
import { GetUserInfoFacadeService } from './facade/get-user-info-facade.service';
import { UserSearchDto } from './dto/user-search.dto';
import { UserSearchFacadeService } from './facade/user-search-facade.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly getUserInfoFacadeService: GetUserInfoFacadeService,
    private readonly userSearchFacadeService: UserSearchFacadeService,
  ) {}

  @Get('info')
  @UseGuards(AuthGuard('access'))
  async getUserInfo(@Req() req: Request, @Res() res) {
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
}
