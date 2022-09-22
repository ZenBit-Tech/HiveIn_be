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
    const { freelancer } = createContractDto;

    return await this.contractRepo
      .createQueryBuilder('contracts')
      .insert()
      .into(Contracts)
      .values([
        {
          ...createContractDto,
          ...(freelancer && { freelancer: { id: +freelancer } }),
        },
      ])
      .execute();
  }

  async findAll(): Promise<Contracts[]> {
    return await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('contracts.freelancer', 'freelancer')
      .getMany();
  }

  async findOwnAsClient(userId: number): Promise<Contracts[]> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('contracts.freelancer', 'freelancer')
      .where({ jobPost: { user: { id: userId } } })
      .getMany();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async findOwnAsFreelancer(freelancerId: number): Promise<Contracts[]> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('contracts.freelancer', 'freelancer')
      .where({ freelancer: { user: { id: freelancerId } } })
      .getMany();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async findOne(id: number): Promise<Contracts> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('contracts.freelancer', 'freelancer')
      .where({ id: id })
      .getOne();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async update(
    id: number,
    updateContractDto: UpdateContractDto,
  ): Promise<void> {
    const contract = await this.findOne(id);

    const { isContractStart, isContractEnd, freelancer } = updateContractDto;

    if (isContractStart) contract.startDate = new Date();
    if (isContractEnd) contract.endDate = new Date();

    await this.contractRepo
      .createQueryBuilder('contracts')
      .update(Contracts)
      .set({
        startDate: contract.startDate,
        endDate: contract.endDate,
        ...(freelancer && { freelancer: { id: +freelancer } }),
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
