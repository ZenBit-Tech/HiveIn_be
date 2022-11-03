import { RecentlyViewedFreelancers } from 'src/modules/client/entities/recently-viewed-freelancers.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, Freelancer, RecentlyViewedFreelancers]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '7200s' },
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
