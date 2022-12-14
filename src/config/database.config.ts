import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: '.production.env',
});

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get<string>('MYSQL_HOST'),
  port: configService.get<number>('MYSQL_PORT'),
  username: configService.get<string>('MYSQL_USER'),
  password: configService.get<string>('MYSQL_PASSWORD'),
  database: configService.get<string>('MYSQL_DB_NAME'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  timezone: 'Z',
  logging: true,
  migrationsRun: true,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
