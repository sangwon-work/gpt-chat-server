import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '../core/core.module';
import { FeatureModule } from '../feature/feature.module';
import { SharedModule } from '../shared/shared.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from '../feature/redis/redis.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      renderPath: '/',
    }),
    CoreModule,
    FeatureModule,
    SharedModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
