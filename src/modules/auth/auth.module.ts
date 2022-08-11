import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
