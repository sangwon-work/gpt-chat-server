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
import { LoginDto } from './dto/login.dto';
import { SignupFacadeService } from './facade/signup-facade.service';
import { LoginFacadeService } from './facade/login-facade.service';
import { AccessTokenRefreshFacadeService } from './facade/access-token-refresh-facade.service';
import { GetUserInfoFacadeService } from './facade/get-user-info-facade.service';
import { UserSearchDto } from './dto/user-search.dto';
import { UserSearchFacadeService } from './facade/user-search-facade.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly signupFacadeService: SignupFacadeService,
    private readonly loginFacadeService: LoginFacadeService,
    private readonly accessTokenRefreshFacadeService: AccessTokenRefreshFacadeService,
    private readonly getUserInfoFacadeService: GetUserInfoFacadeService,
    private readonly userSearchFacadeService: UserSearchFacadeService,
  ) {}

  /**
   * 회원가입
   * @param req
   * @param res
   * @param signupVo
   */
  @Post('signup')
  async signup(
    @Req() req: Request,
    @Res() res: Response,
    @Body() signupVo: SignupDto,
  ) {
    try {
      const { rescode, body } = await this.signupFacadeService.signup(signupVo);
      return this.responseService.response(res, 200, rescode, {}, body);
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  /**
   * 로그인
   * @param req
   * @param res
   * @param loginVo
   */
  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginVo: LoginDto,
  ) {
    try {
      const { rescode, body } = await this.loginFacadeService.login(loginVo);
      return this.responseService.response(res, 200, rescode, {}, body);
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

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

  @Get('token-validation')
  @UseGuards(AuthGuard('access'))
  async getTokenValidation(@Req() req: Request, @Res() res: Response) {
    try {
      return this.responseService.response(res, 200, '0000', {}, {});
    } catch (err) {
      return this.responseService.response(res, 500, '9999', {}, {});
    }
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard('refresh'))
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const { userpkey, nickname } = req['user'];
      // 토큰 재발급
      const { accesstoken, refreshtoken } =
        await this.accessTokenRefreshFacadeService.refreshToken(
          userpkey,
          nickname,
        );
      return this.responseService.response(
        res,
        200,
        '0000',
        {},
        { accesstoken, refreshtoken },
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
