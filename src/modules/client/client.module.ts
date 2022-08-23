import { Clients } from '../entities/clients.entity';
import { Freelancers } from '../entities/freelancers.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, Freelancers, Clients]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '7200s' },
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
