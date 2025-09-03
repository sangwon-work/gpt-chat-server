import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response as ExpressResponse, Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { LoginFacadeService } from './facade/login-facade.service';
// eslint-disable-next-line max-len
import { AccessTokenRefreshFacadeService } from './facade/access-token-refresh-facade.service';
import { AuthGuard } from '@nestjs/passport';
import { SignupFacadeService } from './facade/signup-facade.service';
import { SignupDto } from '../user/dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../core/configuration/configuration.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupFacadeService: SignupFacadeService,
    private readonly loginFacadeService: LoginFacadeService,
    private readonly accessTokenRefreshFacadeService: AccessTokenRefreshFacadeService,
    private readonly configService: ConfigService,
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
    @Res() res: ExpressResponse,
    @Body() signupVo: SignupDto,
  ) {
    try {
      const { rescode, body } = await this.signupFacadeService.signup(signupVo);
      if (rescode === '0000') {
        const cookieConfig = this.configService.get<Configuration>('cookie');
        res.cookie('refreshtoken', body.refreshtoken, {
          httpOnly: true,
          secure: cookieConfig.cookie.secure,
          // eslint-disable-next-line max-len
          sameSite: (cookieConfig.cookie.same_site ?? 'lax') as
            | true
            | false
            | 'lax'
            | 'strict'
            | 'none', // 크로스 서브도메인/도메인이라면 none
          domain: cookieConfig.cookie.domain, // 여러 서브도메인에서 공유하려면
          path: '/', // 스코프 최소화
          maxAge: 1000 * 60 * 60 * 24 * 21, // 예: 21일
        });

        return res.status(200).json({
          resCode: '0000',
          message: '성공',
          body: { accesstoken: body.accesstoken },
        });
      } else {
        return res.status(200).json({
          resCode: rescode,
          message:
            rescode === '0001' ? '핸드폰번호가 중복됩니다.' : '회원가입 실패',
          body: {},
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ resCode: '9999', message: '서버오류', body: {} });
    }
  }

  @Post('login')
  async loing(
    @Req() req: Request,
    @Res() res: ExpressResponse,
    @Body() loginDto: LoginDto,
  ) {
    try {
      const { rescode, body } = await this.loginFacadeService.login(loginDto);
      if (rescode === '0000') {
        const cookieConfig =
          this.configService.get<Configuration['cookie']>('cookie');
        res.cookie('refreshtoken', body.refreshtoken, {
          httpOnly: true,
          secure: cookieConfig.secure,
          // eslint-disable-next-line max-len
          sameSite: (cookieConfig.same_site ?? 'lax') as
            | true
            | false
            | 'lax'
            | 'strict'
            | 'none', // 크로스 서브도메인/도메인이라면 none
          domain: cookieConfig.domain, // 여러 서브도메인에서 공유하려면
          path: '/', // 스코프 최소화
          maxAge: 1000 * 60 * 60 * 24 * 21, // 예: 21일
        });

        return res.status(200).json({
          resCode: '0000',
          message: '성공',
          body: { accesstoken: body.accesstoken },
        });
      } else {
        return res.status(200).json({
          resCode: rescode,
          message:
            rescode === '0002'
              ? '회원을 찾을 수 없습니다.'
              : rescode === '0003'
                ? '비밀번호가 일치하지 않습니다.'
                : '로그인 실패',
          body: {},
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ resCode: '9999', message: '서버오류', body: {} });
    }
  }

  @Get('token-validation')
  @UseGuards(AuthGuard('access'))
  async getTokenValidation(@Req() req: Request, @Res() res: ExpressResponse) {
    try {
      return res
        .status(200)
        .json({ resCode: '0000', message: '성공', body: {} });
    } catch (err) {
      return res
        .status(500)
        .json({ resCode: '9999', message: '서버오류', body: {} });
    }
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard('refresh'))
  async refreshToken(@Req() req: Request, @Res() res: ExpressResponse) {
    try {
      const { userpkey, nickname } = (req as any).user;
      // 토큰 재발급
      const { accesstoken, refreshtoken } =
        await this.accessTokenRefreshFacadeService.refreshToken(
          userpkey,
          nickname,
        );

      const cookieConfig =
        this.configService.get<Configuration['cookie']>('cookie');
      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        secure: cookieConfig.secure,
        // eslint-disable-next-line max-len
        sameSite: (cookieConfig.same_site ?? 'lax') as
          | true
          | false
          | 'lax'
          | 'strict'
          | 'none', // 크로스 서브도메인/도메인이라면 none
        domain: cookieConfig.domain, // 여러 서브도메인에서 공유하려면
        path: '/', // 스코프 최소화
        maxAge: 1000 * 60 * 60 * 24 * 21, // 예: 21일
      });

      return res.status(200).json({
        resCode: '0000',
        message: '성공',
        body: { accesstoken, refreshtoken },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ resCode: '9999', message: '서버오류', body: {} });
    }
  }
}
