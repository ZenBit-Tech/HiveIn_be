import { Skill } from 'src/modules/skill/entities/skill.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { CandidateFilterDto } from './dto/candidate-filter.dto';

@Injectable()
export class ClientService {
  constructor(
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
      .leftJoinAndSelect('freelancer.user', 'users')
      .leftJoinAndSelect('users.avatar', 'avatar')
      .where({
        category: {
          id: +filters.category,
        },
      })
      .getMany();

    const filterKeyWords = filters.keyWords.toLowerCase().split(' ');

    const filterSkills: number[] = filters.skills
      .split(',')
      .map((skill) => +skill);

    const result = filterByCategory.filter((freelancer: Freelancer) => {
      const resultKeyWordsFilter =
        freelancer.user.description
          .toLowerCase()
          .split(' ')
          .concat(freelancer.position.toLowerCase().split(' '))
          .filter((descriptionWord: string) =>
            filterKeyWords.includes(descriptionWord),
          ).length !== 0;

      const resultSkillsFilter =
        freelancer.skills.filter((skill: Skill) =>
          filterSkills.includes(skill.id),
        ).length !== 0;

      return resultKeyWordsFilter && resultSkillsFilter;
    });

    return await this.addSavesField(userId, result);
  }

  async getRecentlyViewedFreelancer(userId: any) {
    const { recentlyViewedFreelancers } = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.recentlyViewedFreelancers', 'freelancer')
      .leftJoinAndSelect('freelancer.user', 'freelancerUser')
      .leftJoinAndSelect('freelancerUser.avatar', 'avatar')
      .where({ id: userId })
      .getOne();

    return await this.addSavesField(userId, recentlyViewedFreelancers);
  }

  async viewFreelancer(userId: number, freelancerId: number) {
    const freelancer = await this.freelancersRepo.findOneBy({
      id: freelancerId,
    });

    const user = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.recentlyViewedFreelancers', 'freelancer')
      .leftJoinAndSelect('freelancer.user', 'freelancerUser')
      .leftJoinAndSelect('freelancerUser.avatar', 'avatar')
      .where({ id: userId })
      .getOne();

    user.recentlyViewedFreelancers.push(freelancer);

    this.usersRepo.save(user);
    return await this.addSavesField(userId, user.recentlyViewedFreelancers);
  }

  async getSavedFreelancers(userId: number) {
    const { savedFreelancers } = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.savedFreelancers', 'savedFreelancers')
      .leftJoinAndSelect('savedFreelancers.user', 'savedFreelancersUser')
      .leftJoinAndSelect('savedFreelancersUser.avatar', 'avatar')
      .where({ id: userId })
      .getOne();

    return savedFreelancers.map((freelancer) => {
      return { saved: true, ...freelancer };
    });
  }

  async saveFreelancer(userId: number, freelancerUserId: number) {
    const freelancer = await this.freelancersRepo.findOneBy({
      userId: freelancerUserId,
    });

    const user = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.savedFreelancers', 'savedFreelancers')
      .where({ id: userId })
      .getOne();
    if (
      user.savedFreelancers.filter(
        (freelancer) => freelancer.userId === +freelancerUserId,
      ).length !== 0
    ) {
      user.savedFreelancers = user.savedFreelancers.filter(
        (freelancer) => freelancer.userId !== +freelancerUserId,
      );
    } else {
      user.savedFreelancers.push(freelancer);
    }
    return (await this.usersRepo.save(user)).savedFreelancers;
  }

  async getHiredFreelancers(userId: number) {
    const { hiredFreelancers } = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.savedFreelancers', 'savedFreelancers')
      .leftJoinAndSelect('user.hiredFreelancers', 'hiredFreelancers')
      .leftJoinAndSelect('hiredFreelancers.user', 'hiredFreelancersUser')
      .leftJoinAndSelect('hiredFreelancersUser.avatar', 'avatar')

      .where({ id: userId })
      .getOne();

    return await this.addSavesField(userId, hiredFreelancers);
  }

  // helper functions

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
