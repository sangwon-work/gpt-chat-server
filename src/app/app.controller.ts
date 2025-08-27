import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisTestService } from '../feature/redis/service/redis-test.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisTestService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async test() {
    await this.redisService.set('hello', 'world');
    const value = await this.redisService.get('hello');
    return { hello: value };
  }
}
