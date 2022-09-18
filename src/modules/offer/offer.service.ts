import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { createOfferDto } from 'src/modules/offer/dto/create-offer.dto';
import { updateOfferDto } from 'src/modules/offer/dto/update-offer.dto';
import { Status } from 'src/modules/offer/typesDef';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
  ) {}

  async create(data: createOfferDto): Promise<Offer> {
    return this.offerRepo.save({
      status: Status.IN_CONSIDERATION,
      freelancerId: data.freelancerId,
      jobPostId: data.jobPostId,
      initiator: data.initiator,
    });
  }

  async update(data: updateOfferDto): Promise<Offer> {
    const currentOffer = await this.offerRepo.findOneBy({ id: data.id });

    if (!currentOffer) throw new NotFoundException();
    return this.offerRepo.save({ ...currentOffer, status: data.status });
  }
}
