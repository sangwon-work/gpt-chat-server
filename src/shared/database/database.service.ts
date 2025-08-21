import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../core/configuration/configuration.interface';
import { Pool, PoolConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public CP: Pool; // connection pool
  private readonly logger = new Logger('DatabaseService');
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const database =
      this.configService.get<Configuration['database']>('database');

    this.CP = mysql.createPool({
      host: database.host,
      user: database.user,
      password: database.password,
      port: database.port,
      database: database.database,
      connectionLimit: database.connectionLimit,
      // charset: 'utf8mb4',
      // enableKeepAlive: true,
      // keepAliveInitialDelay: 10000,
      timezone: '+00:00',
    });

    this.keepConnectionAlive();
    console.log('✅ START CONNECTION 🚀 ');
  }

  // 주기적으로 ping을 보내서 연결 유지
  private async keepConnectionAlive() {
    setInterval(async () => {
      try {
        const connection = await this.CP.getConnection();
        await connection.ping(); // MySQL 연결 확인
        connection.release();
        console.log('✅ Connection is alive');
      } catch (error) {
        console.error('❌ MySQL connection lost. Reconnecting...', error);
      }
    }, 60000); // 60초마다 실행
  }

  /**
   * connection 가져오기
   */
  async getDBConnection(): Promise<PoolConnection> {
    try {
      return await this.CP.getConnection();
    } catch (err) {
      this.logger.error(`Database Get Connection ${err.message}`);
      throw err;
    }
  }

  /**
   * 쿼리 보내기
   * @param connection
   * @param sql
   * @param params
   */
  async dbQuery(
    connection: PoolConnection,
    sql: string,
    params: any[],
  ): Promise<any> {
    try {
      const querySet = await connection.query(sql, params);

      return querySet[0];
    } catch (err) {
      err.name = 'DBError';
      throw err;
    }
  }
}
