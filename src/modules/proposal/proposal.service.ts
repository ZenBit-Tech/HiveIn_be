import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { Proposal } from './entities/proposal.entity';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly jobPostRepository: Repository<Proposal>,
  ) {}

  async create({ coverLetter, rate }: CreateProposalDto) {
    return await this.jobPostRepository.save({
      coverLetter,
      rate,
    });
  }

  // async findOne(id: number) {
  //   return await this.jobPostRepository.findOne({
  //     where: { id: id },
  //     relations: ['category', 'skills', 'user'],
  //   });
  // }

  // async findByUser(userId: number) {
  //   return await this.jobPostRepository.find({
  //     where: { user: { id: userId } },
  //     relations: ['category', 'skills', 'user'],
  //   });
  // }

  // async remove(id: number) {
  //   return await this.jobPostRepository.delete(id);
  // }
}
