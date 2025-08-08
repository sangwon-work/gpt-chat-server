import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccessStrategy } from './strategy/access.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { AuthModel } from './auth.model';

@Global()
@Module({
  imports: [PassportModule],
  providers: [AuthModel, AccessStrategy, RefreshStrategy],
  exports: [],
})
export class AuthModule {}
