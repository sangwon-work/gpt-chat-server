import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../configuration/configuration.interface';
import { Request } from 'express';
import { DatabaseService } from '../../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { AuthModel } from '../auth.model';

function cookieExtractor(req: Request) {
  return req?.cookies?.refreshToken || null;
}

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private databaseService: DatabaseService,
    private authModel: AuthModel,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // 핵심
      ignoreExpiration: false,
      secretOrKey:
        configService.get<Configuration['jwt']>('jwt').refresh_secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.databaseService.getDBConnection();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userpkey } = payload;
      const authorization = req.cookies.refreshtoken;
      console.log('authorization: ', authorization);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // const [identifier, token] = authorization.split(' ');

      // 회원 토큰 조회
      // const usertokenset = await this.authModel.getToken(
      //   connection,
      //   uid
      // );
      //
      // if (usertokenset.length <= 0) {
      //   // 저장된 토큰이 없음 (로그아웃한 이후 재사용할 가능성있음)
      //   return false;
      // } else {
      //   const usertoken = usertokenset[0];
      //   if (usertoken.refreshtoken === token) {
      //     // 저장된 토큰 일치
      //     payload.userpkey = usertoken.userpkey;
      //     return payload;
      //   } else {
      //     // 저장된 refresh token 과 일치하지 않음
      //     return false;
      //   }
      // }

      return payload;
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
