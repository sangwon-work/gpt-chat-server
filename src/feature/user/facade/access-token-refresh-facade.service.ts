import { Injectable } from '@nestjs/common';
import { JwtSignService } from '../../../shared/jwt/jwt-sign.service';

@Injectable()
export class AccessTokenRefreshFacadeService {
  constructor(private readonly jwtSignService: JwtSignService) {}

  async refreshToken(
    userpkey: number,
    nickname: string,
  ): Promise<{ accesstoken: string; refreshtoken: string }> {
    try {
      const accesstoken = await this.jwtSignService.generateAccessToken({
        userpkey,
        nickname,
      });
      const refreshtoken = await this.jwtSignService.generateRefreshToken({
        userpkey,
        nickname,
      });

      return { accesstoken, refreshtoken };
    } catch (err) {
      throw err;
    }
  }
}
