import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from 'src/modules/offer/entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OfferService],
})
export class OfferModule {}
