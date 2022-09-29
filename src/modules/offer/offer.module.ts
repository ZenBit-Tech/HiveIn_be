import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferService } from 'src/modules/offer/offer.service';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { OfferController } from 'src/modules/offer/offer.controller';
import { ContractsModule } from 'src/modules/contracts/contracts.module';
import { Users } from 'src/modules/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Users]), ContractsModule],
  providers: [OfferService],
  controllers: [OfferController],
  exports: [OfferService],
})
export class OfferModule {}
