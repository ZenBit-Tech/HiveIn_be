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

  async filterCandidate(userId: number, filters: CandidateFilterDto) {
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

    return await this.addSavesField(userId, result);
  }

  async getRecentlyViewedFreelancer(userId: number) {
    const clientId = await this.getClientIdByUserId(userId);

    const { recentlyViewedFreelancers } = await this.clientsRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.recentlyViewedFreelancers', 'freelancer')
      .leftJoinAndSelect('freelancer.user', 'user')
      .where({ id: clientId })
      .getOne();

    return await this.addSavesField(userId, recentlyViewedFreelancers);
  }

  async viewFreelancer(userId: number, freelancerId: number) {
    const clientId = await this.getClientIdByUserId(userId);

    const freelancer = await this.freelancersRepo.findOneBy({
      id: freelancerId,
    });

    const client = await this.clientsRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.recentlyViewedFreelancers', 'freelancer')
      .where({ id: clientId })
      .getOne();

    client.recentlyViewedFreelancers.push(freelancer);

    this.clientsRepo.save(client);
    return await this.addSavesField(userId, client.recentlyViewedFreelancers);
  }

  async getSavedFreelancers(userId: number) {
    const clientId = await this.getClientIdByUserId(userId);

    const { savedFreelancers } = await this.clientsRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.savedFreelancers', 'freelancer')
      .leftJoinAndSelect('freelancer.user', 'user')
      .where({ id: clientId })
      .getOne();

    return savedFreelancers.map((freelancer) => {
      return { saved: true, ...freelancer };
    });
  }

  async saveFreelancer(userId: number, freelancerId: number) {
    const clientId = await this.getClientIdByUserId(userId);

    const freelancer = await this.freelancersRepo.findOneBy({
      id: freelancerId,
    });

    const client = await this.clientsRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.savedFreelancers', 'freelancer')
      .where({ id: clientId })
      .getOne();

    client.savedFreelancers.push(freelancer);

    return (await this.clientsRepo.save(client)).savedFreelancers;
  }

  // helper functions

  async getClientIdByUserId(userId: number) {
    const {
      client: { id: clientId },
    } = await this.usersRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.client', 'client')
      .where({ id: userId })
      .getOne();
    return clientId;
  }

  async getIdAllSavedFreelancers(userId: number) {
    const freelancers = await this.getSavedFreelancers(userId);
    return freelancers.map(({ id }: Freelancer) => id);
  }

  async addSavesField(userId: number, freelancers: Freelancer[]) {
    const idSavedFreelancers = await this.getIdAllSavedFreelancers(userId);

    return freelancers.map((freelancer: Freelancer) => {
      return {
        saved: idSavedFreelancers.includes(freelancer.id),
        ...freelancer,
      };
    });
  }
}
