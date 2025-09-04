import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../core/configuration/configuration.interface';

/**
 * access, refresh token 발급
 */
@Injectable()
export class JwtSignService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: {
    userpkey: number;
    nickname: string;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<Configuration['jwt']>('jwt').access_secret,
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(payload: {
    userpkey: number;
    nickname: string;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<Configuration['jwt']>('jwt').refresh_secret,
      expiresIn: '21d',
    });
  }
}
