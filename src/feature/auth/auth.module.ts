import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LoginFacadeService } from './facade/login-facade.service';
import { AccessTokenRefreshFacadeService } from './facade/access-token-refresh-facade.service';
import { SignupFacadeService } from './facade/signup-facade.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    LoginFacadeService,
    AccessTokenRefreshFacadeService,
    SignupFacadeService,
  ],
})
export class AuthModule {}
