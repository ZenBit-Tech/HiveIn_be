import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirstModule } from './modules/first-module/entities/first-module.entity';
import { FirstModuleModule } from './modules/first-module/first-module.module';
import { ConfigModule } from '@nestjs/config/t';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [FirstModule],
      synchronize: false,
    }),
    ConfigModule.forRoot(),
    FirstModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
