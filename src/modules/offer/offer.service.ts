import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { CreateOfferDto } from 'src/modules/offer/dto/create-offer.dto';
import { UpdateOfferDto } from 'src/modules/offer/dto/update-offer.dto';
import { Status } from 'src/modules/offer/typesDef';
import { ContractsService } from 'src/modules/contracts/contracts.service';
import { UserRole, Users } from 'src/modules/entities/users.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly contractsService: ContractsService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<InsertResult> {
    return await this.offerRepository
      .createQueryBuilder('offer')
      .insert()
      .into(Offer)
      .values([
        {
          status: Status.PENDING,
          freelancer: { id: createOfferDto.freelancerId },
          jobPost: { id: createOfferDto.jobPostId },
        },
      ])
      .execute();
  }

  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    const currentOffer = await this.offerRepository.findOneBy({ id });

    if (!currentOffer) throw new NotFoundException();

    const offer = await this.offerRepository.save({
      ...currentOffer,
      status: updateOfferDto.status,
    });

    if (offer.status === Status.ACCEPTED)
      await this.contractsService.create({
        offer,
        startDate: new Date(),
        endDate: null,
      });

    return offer;
  }

  async getAllOwn(userId: number): Promise<Offer[]> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (user.role === UserRole.UNDEFINED) throw new ForbiddenException();

    if (user.role === UserRole.FREELANCER)
      return await this.getAllOwnAsFreelancer(userId);

    if (user.role === UserRole.CLIENT)
      return await this.getAllOwnAsClient(userId);
  }

  private async getAllOwnAsFreelancer(userId: number): Promise<Offer[]> {
    return await this.offerRepository
      .createQueryBuilder('offer')
      .leftJoin('offer.freelancer', 'freelancer')
      .leftJoin('freelancer.user', 'user')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoinAndSelect(
        'jobPost.category',
        'category',
        'jobPost.categoryId = category.id',
      )
      .leftJoinAndSelect('jobPost.user', 'client')
      .where(`user.id = ${userId}`)
      .andWhere(`offer.status != :accepted`, { accepted: Status.ACCEPTED })
      .getMany();
  }

  private async getAllOwnAsClient(userId: number): Promise<Offer[]> {
    return await this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.freelancer', 'freelancer')
      .leftJoinAndSelect('freelancer.user', 'user')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoin('jobPost.user', 'client')
      .where(`client.id = ${userId}`)
      .getMany();
  }

  async getOneById(id: number): Promise<Offer> {
    return await this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.freelancer', 'freelancer')
      .leftJoinAndSelect('freelancer.user', 'userFreelancer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'userClient')
      .where(`offer.id = ${id}`)
      .getOne();
  }
}
