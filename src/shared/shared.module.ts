import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JwtUtilModule } from './jwt/jwt-util.module';
import { PasswordModule } from './password/password.module';
import { ResponseModule } from './response/response.module';

@Global()
@Module({
  imports: [DatabaseModule, JwtUtilModule, ResponseModule, PasswordModule],
})
export class SharedModule {}
