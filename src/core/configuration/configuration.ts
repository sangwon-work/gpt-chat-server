import { ConfigFactory } from '@nestjs/config';
import { config } from 'dotenv';
import { Configuration } from './configuration.interface';
import * as process from 'process';
import * as path from 'path';

process.env.NODE_ENV === 'production'
  ? config({ path: path.join(__dirname, '../env/.env.production') })
  : process.env.NODE_ENV === 'development'
    ? config({ path: path.join(__dirname, '../env/.env.development') })
    : config({ path: path.join(__dirname, '../env/.env.local') });

const configuration: Configuration = {
  node_env: process.env.NODE_ENV || 'local',

  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || '',
    refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  },

  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || 'database name',
    connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT) || 10,
  },

  cookie: {
    domain: process.env.COOKIE_DOMAIN || '.localhost',
    secure: process.env.COOKIE_SECURE === 'true' || false,
    same_site: process.env.COOKIE_SAME_SITE || 'none',
  },
};

const configFunction: ConfigFactory<Configuration> = () => configuration;
export default configFunction;
