import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferService } from 'src/modules/offer/offer.service';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { OfferController } from 'src/modules/offer/offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
