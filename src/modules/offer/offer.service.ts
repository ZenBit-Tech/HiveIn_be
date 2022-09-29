import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { createOfferDto } from 'src/modules/offer/dto/create-offer.dto';
import { updateOfferDto } from 'src/modules/offer/dto/update-offer.dto';
import { Status } from 'src/modules/offer/typesDef';
import { ContractsService } from 'src/modules/contracts/contracts.service';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly contractsService: ContractsService,
  ) {}

  async create(data: createOfferDto): Promise<Offer> {
    return this.offerRepository.save({
      status: Status.PENDING,
      freelancer: { id: data.freelancerId },
      jobPostId: { id: data.jobPostId },
    });
  }

  async update(data: updateOfferDto): Promise<Offer> {
    const currentOffer = await this.offerRepository.findOneBy({ id: data.id });

    if (!currentOffer) throw new NotFoundException();

    const offer = await this.offerRepository.save({
      ...currentOffer,
      status: data.status,
    });

    if (offer.status === Status.ACTIVE)
      await this.contractsService.create({
        offer,
        startDate: new Date(),
        endDate: null,
      });

    return offer;
  }

  async getAllOwn(userId: number): Promise<Offer[]> {
    return await this.offerRepository
      .createQueryBuilder('offer')
      .leftJoin('offer.freelancer', 'freelancer')
      .leftJoin('freelancer.user', 'user')
      .where(`user.id = ${userId}`)
      .getMany();
  }

  async getOneById(id: number): Promise<Offer> {
    return await this.offerRepository.findOneBy({ id });
  }
}
