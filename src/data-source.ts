import './boilerplate.polyfill';
import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';

import { UserSubscriber } from './entity-subscribers/user-subscriber';
import { SnakeNamingStrategy } from './snake-naming.strategy';

// Load environment variables from .env file
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [UserSubscriber],
  entities: [
    'src/modules/**/*.entity{.ts,.js}',
    'src/modules/**/*.view-entity{.ts,.js}',
  ],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  // ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  logging: process.env.ENABLE_ORM_LOGS === 'true',
} as DataSourceOptions;

export const appDataSource = new DataSource(dataSourceOptions);
