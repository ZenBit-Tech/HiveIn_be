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
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(data: createOfferDto): Promise<Offer> {
    return this.offerRepository.save({
      status: Status.IN_CONSIDERATION,
      freelancer: { id: data.freelancerId },
      jobPostId: { id: data.jobPostId },
      initiator: data.initiator,
    });
  }

  async update(data: updateOfferDto): Promise<Offer> {
    const currentOffer = await this.offerRepository.findOneBy({ id: data.id });

    if (!currentOffer) throw new NotFoundException();
    return this.offerRepository.save({ ...currentOffer, status: data.status });
  }
}
