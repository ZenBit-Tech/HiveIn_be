import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { OfferController } from './offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
