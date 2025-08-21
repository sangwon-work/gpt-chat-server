import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { SignupFacadeService } from './facade/signup-facade.service';
import { PhoneDuplicateCheckService } from './service/phone-duplicate-check.service';
import { CreateUserService } from './service/create-user.service';
import { LoginFacadeService } from './facade/login-facade.service';
import { GetUserByPhoneService } from './service/get-user-by-phone.service';
import { AccessTokenRefreshFacadeService } from './facade/access-token-refresh-facade.service';
import { GetUserInfoService } from './service/get-user-info.service';
import { GetUserInfoFacadeService } from './facade/get-user-info-facade.service';
import { GetUserSearchListService } from './service/get-user-search-list.service';
import { UserSearchFacadeService } from './facade/user-search-facade.service';
import { GetUserByPkeyService } from './service/get-user-by-pkey.service';

@Module({
  controllers: [UserController],
  providers: [
    UserModel,
    SignupFacadeService,
    PhoneDuplicateCheckService,
    CreateUserService,
    LoginFacadeService,
    GetUserByPhoneService,
    AccessTokenRefreshFacadeService,
    GetUserInfoService,
    GetUserInfoFacadeService,
    GetUserSearchListService,
    UserSearchFacadeService,
    GetUserByPkeyService,
  ],
  exports: [GetUserByPkeyService],
})
export class UserModule {}
