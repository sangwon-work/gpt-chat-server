// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../configuration/configuration.interface';
import { DatabaseService } from '../../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { AuthModel } from '../auth.model';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly authModel: AuthModel,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<Configuration['jwt']>('jwt').access_secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any, done: Function, res: Response) {
    let connection: PoolConnection = undefined;
    try {
      connection = await this.databaseService.getDBConnection();
      const { userpkey } = payload;
      const authorization = req.headers['authorization'];
      const [identifier, token] = authorization.split(' ');

      // if (deviceid === undefined) {
      //   throw new UnauthorizedException({ message: '단말기 정보를 찾을 수 없습니다.' });
      // } else {
      //   // 회원 토큰 조회
      //   const usertokenset = await this.authModel.getToken(
      //     connection,
      //     uid
      //   );
      //
      //   if (usertokenset.length <= 0) {
      //     // 저장된 토큰이 없음 (로그아웃한 이후 재사용할 가능성있음)
      //     if (langcode === 'KO') {
      //       throw new UnauthorizedException({ message: '다시 로그인해주세요.' });
      //     } else {
      //       throw new UnauthorizedException({ message: 'Please log in again.' });
      //     }
      //   } else {
      //     const user = usertokenset[0];
      //     if (user.accesstoken === token) {
      //       if (user.registerdevice === deviceid) {
      //         payload.userpkey = user.userpkey;
      //         payload.phone = user.phone;
      //         payload.usertype = user.usertype;
      //         payload.studentidsetyn = user.studentidsetyn;
      //         payload.yonseimemberyn = user.yonseimemberyn;
      //         // 단말기 정보 일치
      //         return payload;
      //       } else {
      //         if (langcode === 'KO') {
      //           throw new UnauthorizedException({ message: '등록 디바이스가 일치하지 않습니다.' });
      //         } else {
      //           throw new UnauthorizedException({ message: 'The registration device does not match.' });
      //         }
      //       }
      //     } else {
      //       // 저장된 access token과 일치하지 않음
      //       throw new UnauthorizedException({ message: '다른기기에서 로그인했습니다. 다시 로그인해주세요.' });
      //     }
      //   }
      // }
      return payload;
    } catch (err) {
      throw err;
    } finally {
      if (connection !== undefined) {
        connection.release();
      }
    }
  }
}
