import { Module } from '@nestjs/common';
import { RedisTestService } from './service/redis-test.service';

@Module({
  providers: [RedisTestService],
  exports: [RedisTestService],
})
export class RedisModule {}
