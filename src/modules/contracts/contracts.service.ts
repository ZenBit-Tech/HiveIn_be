import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractDto } from 'src/modules/contracts/dto/create-contract.dto';
import { UpdateContractDto } from 'src/modules/contracts/dto/update-contract.dto';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contracts)
    private readonly contractRepo: Repository<Contracts>,
  ) {}

  async create(createContractDto: CreateContractDto) {
    return await this.contractRepo.save({
      freelancer: { id: +createContractDto.freelancerId },
      ...createContractDto,
    });
  }

  async findAll() {
    return await this.contractRepo.find({
      relations: ['jobPost', 'freelancer', 'jobPost.user'],
    });
  }

  async findOwnAsClient(userId: number) {
    const contract = await this.contractRepo.find({
      where: { jobPost: { user: { id: userId } } },
      relations: ['jobPost', 'freelancer', 'jobPost.user'],
    });

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async findOwnAsFreelancer(freelancerId: number) {
    const contract = await this.contractRepo.find({
      where: { freelancer: { user: { id: freelancerId } } },
      relations: ['jobPost', 'freelancer', 'jobPost.user'],
    });

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async findOne(id: number) {
    const contract = await this.contractRepo.findOne({
      where: { id: id },
      relations: ['jobPost', 'freelancer'],
    });

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async update(id: number, updateContractDto: UpdateContractDto) {
    await this.findOne(id);

    const { freelancerId } = updateContractDto;

    await this.contractRepo.save({
      id,
      ...updateContractDto,
      ...(freelancerId && { freelancer: { id: +freelancerId } }),
    });
  }

  async remove(id: number) {
    return await this.contractRepo.delete(id);
  }
}
