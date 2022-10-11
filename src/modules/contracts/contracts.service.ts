import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractDto } from 'src/modules/contracts/dto/create-contract.dto';
import { UpdateContractDto } from 'src/modules/contracts/dto/update-contract.dto';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contracts)
    private readonly contractRepo: Repository<Contracts>,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<InsertResult> {
    const result = await this.contractRepo
      .createQueryBuilder('contracts')
      .insert()
      .into(Contracts)
      .values([createContractDto])
      .execute();

    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .where({ id: result.raw.insertId })
      .getOne();

    console.log(contract);
    const timeDifference = this.getSecondsDiff(new Date(), contract.endDate);

    console.log(timeDifference);

    return result;
  }

  getSecondsDiff = (startDate, endDate) => {
    const msInSecond = 1000;

    return Math.round(
      Math.abs(endDate.getTime() - startDate.getTime()) / msInSecond,
    );
  };

  async findAll(): Promise<Contracts[]> {
    return await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoinAndSelect('offer.freelancer', 'freelancer')
      .getMany();
  }

  async findOwnAsClient(userId: number): Promise<Contracts[]> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .where(`user.id = ${userId}`)
      .getMany();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async findOwnAsFreelancer(freelancerId: number): Promise<Contracts[]> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoin('offer.freelancer', 'freelancer')
      .where(`freelancer.userId = ${freelancerId}`)
      .getMany();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async findOne(id: number): Promise<Contracts> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoinAndSelect('offer.freelancer', 'freelancer')
      .where(`contracts.id = ${id}`)
      .getOne();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async update(
    id: number,
    updateContractDto: UpdateContractDto,
  ): Promise<void> {
    const contract = await this.findOne(id);

    const { isContractStart, isContractEnd } = updateContractDto;

    if (isContractStart) contract.startDate = new Date();
    if (isContractEnd) contract.endDate = new Date();

    await this.contractRepo
      .createQueryBuilder('contracts')
      .update(Contracts)
      .set({
        startDate: contract.startDate,
        endDate: contract.endDate,
      })
      .where('id = :id', { id: id })
      .execute();
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.contractRepo
      .createQueryBuilder('contracts')
      .delete()
      .from(Contracts)
      .where('id = :id', { id: id })
      .execute();
  }
}
