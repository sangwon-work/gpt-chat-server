import { Injectable } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { PhoneDuplicateCheckService } from '../service/phone-duplicate-check.service';
import { PasswordService } from '../../../shared/password/password.service';
import { CreateUserService } from '../service/create-user.service';
import { JwtSignService } from '../../../shared/jwt/jwt-sign.service';

@Injectable()
export class SignupFacadeService {
  constructor(
    private readonly phoneDuplicateCheckService: PhoneDuplicateCheckService,
    private readonly passwordService: PasswordService,
    private readonly createUserService: CreateUserService,
    private readonly jwtSignService: JwtSignService,
  ) {}

  async signup(signupVo: SignupDto): Promise<{
    rescode: string;
    body: { accesstoken: string; refreshtoken: string };
  }> {
    try {
      // 핸드폰번호 중복체크
      const isDuplicate: boolean =
        await this.phoneDuplicateCheckService.isDuplicate(signupVo.phone);

      if (isDuplicate === true) {
        // 핸드폰번호가 중복됨
        return { rescode: '0001', body: { accesstoken: '', refreshtoken: '' } };
      } else {
        // 비밀번호 암호화
        const password: string = this.passwordService.encrypt(
          signupVo.password,
        );

        console.log(
          `password: ${password}, password length: ${password.length}`,
        );
        // 회원 생성
        const { userpkey } = await this.createUserService.createUser(
          signupVo.phone,
          password,
          signupVo.nickname,
        );
        // jwt 토큰 발급
        const accesstoken: string =
          await this.jwtSignService.generateAccessToken({
            userpkey: userpkey,
            nickname: signupVo.nickname,
          });
        const refreshtoken: string =
          await this.jwtSignService.generateRefreshToken({
            userpkey: userpkey,
            nickname: signupVo.nickname,
          });

        return { rescode: '0000', body: { accesstoken, refreshtoken } };
      }
    } catch (err) {
      throw err;
    }
  }
}
