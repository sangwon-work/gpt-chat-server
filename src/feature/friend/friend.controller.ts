import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  Response,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ResponseService } from '../../shared/response/response.service';
import { AuthGuard } from '@nestjs/passport';
import { GetFriendListFacadeService } from './facade/get-friend-list-facade.service';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequestFacadeService } from './facade/friend-request-facade.service';
// eslint-disable-next-line max-len
import { GetFriendDiscoverListFacadeService } from './facade/get-friend-discover-list-facade.service';
import { FriendAcceptDto } from './dto/friend-accept.dto';
import { FriendAcceptFacadeService } from './facade/friend-accept-facade.service';

@Controller('friend')
export class FriendController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly getFriendListFacadeService: GetFriendListFacadeService,
    private readonly friendRequestFacadeService: FriendRequestFacadeService,
    private readonly getFriendDiscoverListFacadeService: GetFriendDiscoverListFacadeService,
    private readonly friendAcceptFacadeService: FriendAcceptFacadeService,
  ) {}

  // 친구 목록
  @Get('/list')
  @UseGuards(AuthGuard('access'))
  async getFriendList(@Req() req: Request, @Res() res: Response) {
    try {
      const { userpkey } = req['user'];
      const { friendcount, friendlist } =
        await this.getFriendListFacadeService.getFriendList(userpkey);
      return this.responseService.response(
        res,
        200,
        '0000',
        {},
        { friendcount, friendlist },
      );
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 친구 검색
  @Get('/search')
  @UseGuards(AuthGuard('access'))
  async getFriendSearch(@Req() req: Request, @Res() res: Response) {
    try {
      return this.responseService.response(res, 200, '0000', {}, {});
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 친구 요청
  @Post('/request')
  @UseGuards(AuthGuard('access'))
  async getFriendRequests(
    @Req() req: Request,
    @Res() res: Response,
    @Body() friendRequestDto: FriendRequestDto,
  ) {
    try {
      const { userpkey } = req['user'];
      const { rescode } = await this.friendRequestFacadeService.friendRequest(
        userpkey,
        friendRequestDto,
      );
      return this.responseService.response(res, 200, rescode, {}, {});
    } catch (err) {
      console.log(err);
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 친구 수락
  @Post('/accept')
  @UseGuards(AuthGuard('access'))
  async getFriendAccept(
    @Req() req: Request,
    @Res() res: Response,
    @Body() friendAcceptDto: FriendAcceptDto,
  ) {
    try {
      const { userpkey } = req['user'];
      const { rescode } = await this.friendAcceptFacadeService.acceptFriend(
        userpkey,
        friendAcceptDto,
      );
      return this.responseService.response(res, 200, rescode, {}, {});
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  // 친구 요청 목록 조회
  @Get('discover')
  @UseGuards(AuthGuard('access'))
  async getFriendDiscover(@Req() req: Request, @Res() res: Response) {
    try {
      const { userpkey } = req['user'];

      const { userlist } =
        await this.getFriendDiscoverListFacadeService.getFriendDiscoverList(
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
      console.log(err);
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }
}
