import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { Freelancer } from './entities/freelancer.entity';

@Injectable()
export class FreelancerService {
  constructor(
    @InjectRepository(Freelancer)
    private freelancerRepository: Repository<Freelancer>,
  ) {}
  create(data: CreateFreelancerDto) {
    const skills = data.skillsIds.map((value) => ({
      id: value,
    }));
    return this.freelancerRepository.save({
      categoryId: data.categoryId,
      englishLevel: data.englishLevel,
      position: data.position,
      rate: data.rate,
      userId: data.userId,
      skills: skills,
      experience: data.experiences,
      education: data.educations,
    });
  }

  async findAll() {
    const freelancerQuery = new FreelancerQueryBuilder(
      this.freelancerRepository,
    );
    return freelancerQuery
      .init()
      .getCategory()
      .getEducation()
      .getExperience()
      .getSkills()
      .query.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} freelancer`;
  }

  update(id: number, updateFreelancerDto: UpdateFreelancerDto) {
    return `This action updates a #${id} freelancer`;
  }

  remove(id: number) {
    return `This action removes a #${id} freelancer`;
  }
}

class FreelancerQueryBuilder {
  private _query: SelectQueryBuilder<Freelancer>;

  constructor(private freelancerRepository: Repository<Freelancer>) {}

  get query() {
    return this._query;
  }

  init() {
    this._query = this.freelancerRepository.createQueryBuilder('freelancer');
    return this;
  }

  getEducation() {
    this._query = this._query.leftJoinAndSelect(
      'freelancer.education',
      'education',
      'freelancer.id = education.freelancerId',
    );
    return this;
  }

  getExperience() {
    this._query = this._query.leftJoinAndSelect(
      'freelancer.experience',
      'experience',
      'freelancer.id = experience.freelancerId',
    );
    return this;
  }

  getCategory() {
    this._query = this._query.leftJoinAndSelect(
      'freelancer.category',
      'category',
      'freelancer.categoryId = category.id',
    );
    return this;
  }

  getSkills() {
    this._query = this._query.leftJoinAndSelect('freelancer.skills', 'skill');
    return this;
  }
}
