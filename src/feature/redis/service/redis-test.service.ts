// src/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisTestService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: 'redis', // Docker나 서버 Redis 주소
      port: 6379,
      maxRetriesPerRequest: null, // 재시도 제한 해제
      enableReadyCheck: false, // ready check 비활성화
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async set(key: string, value: string) {
    await this.client.set(key, value, 'EX', 100); // 100초 TTL
  }

  async get(key: string) {
    return this.client.get(key);
  }
}
