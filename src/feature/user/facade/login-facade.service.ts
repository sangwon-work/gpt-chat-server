import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { GetUserByPhoneService } from '../service/get-user-by-phone.service';
import { PasswordService } from '../../../shared/password/password.service';
import { JwtSignService } from '../../../shared/jwt/jwt-sign.service';

@Injectable()
export class LoginFacadeService {
  constructor(
    private readonly getUserByPhoneService: GetUserByPhoneService,
    private readonly passwordService: PasswordService,
    private readonly jwtSignService: JwtSignService,
  ) {}

  async login(loginVo: LoginDto): Promise<{
    rescode: string;
    body: { accesstoken: string; refreshtoken: string };
  }> {
    try {
      // 회원 조회
      const { user } = await this.getUserByPhoneService.getUser(loginVo.phone);
      if (user === null) {
        // 회원을 찾을 없음
        return { rescode: '0002', body: { accesstoken: '', refreshtoken: '' } };
      } else {
        // 비밀번호 일치여부 확인
        const isvalid: boolean = this.passwordService.valid(
          user.password,
          loginVo.password,
        );

        if (isvalid === true) {
          const accesstoken: string =
            await this.jwtSignService.generateAccessToken({
              userpkey: user.userpkey,
              nickname: user.nickname,
            });
          const refreshtoken: string =
            await this.jwtSignService.generateRefreshToken({
              userpkey: user.userpkey,
              nickname: user.nickname,
            });

          return {
            rescode: '0000',
            body: { accesstoken: accesstoken, refreshtoken: refreshtoken },
          };
        } else {
          // 비밀번호 불일치
          return {
            rescode: '0003',
            body: { accesstoken: '', refreshtoken: '' },
          };
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
