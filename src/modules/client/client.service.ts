import { Skill } from './../skill/entities/skill.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Clients } from './../entities/clients.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, ArrayOverlap, In, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CandidateFilterDto } from './dto/candidate-filter.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientsRepo: Repository<Clients>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Freelancer)
    private readonly freelancersRepo: Repository<Freelancer>,
  ) {}

  async getClientIdByUserId(id: number) {
    const {
      client: { id: clientId },
    } = await this.usersRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.client', 'client')
      .where({ id })
      .getOne();
    return clientId;
  }

  async recentlyViewed(id: number) {
    const clientId = await this.getClientIdByUserId(id);

    const { recentlyViewedFreelancers } = await this.clientsRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.recentlyViewedFreelancers', 'freelancer')
      .leftJoinAndSelect('freelancer.user', 'user')
      .where({ id: clientId })
      .getOne();

    return recentlyViewedFreelancers;
  }

  async filterCandidate(filters: CandidateFilterDto) {
    const filterByCategory = await this.freelancersRepo
      .createQueryBuilder('freelancer')
      .leftJoinAndSelect('freelancer.category', 'category')
      .leftJoinAndSelect('freelancer.skills', 'skills')
      .where({
        category: {
          name: filters.category,
        },
      })
      .getMany();

    const filterKeyWords = filters.keyWords.toLowerCase().split(' ');

    const filterSkills = filters.skills;
    const result = filterByCategory.filter((freelancer: Freelancer) => {
      const resultKeyWordsFilter =
        freelancer.description
          .toLowerCase()
          .split(' ')
          .concat(freelancer.position.toLowerCase().split(' '))
          .filter((descriptionWord: string) =>
            filterKeyWords.includes(descriptionWord),
          ).length !== 0;

      const resultSkillsFilter =
        freelancer.skills.filter((skill: Skill) =>
          filterSkills.includes(skill.name),
        ).length !== 0;

      return resultKeyWordsFilter && resultSkillsFilter;
    });

    return result;
  }
}
