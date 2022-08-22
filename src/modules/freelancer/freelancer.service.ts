import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Education } from '../education/entities/education.entity';
import { Experience } from '../experience/entities/experience.entity';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { Freelancer } from './entities/freelancer.entity';

@Injectable()
export class FreelancerService {
  constructor(
    @InjectRepository(Freelancer)
    private freelancerRepository: Repository<Freelancer>,
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}
  async create(data: CreateFreelancerDto) {
    const skills = data.skillsIds.map((value) => ({
      id: value,
    }));
    if (skills.length < 3) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Insert at least 3 Skills',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
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

  findOneByUserId(id: number) {
    const freelancerQuery = new FreelancerQueryBuilder(
      this.freelancerRepository,
    );
    return freelancerQuery
      .init()
      .getCategory()
      .getEducation()
      .getExperience()
      .getSkills()
      .query.where(`freelancer.userId = ${id}`)
      .getOne();
  }

  async update(id: number, data: UpdateFreelancerDto): Promise<Freelancer> {
    try {
      const { educations, experiences, skillsIds, ...rest } = data;
      const skills = (skillsIds || []).map((value) => ({
        id: value,
      }));
      const education = educations
        ? educations.map((education) => ({
            freelancerId: id,
            ...education,
          }))
        : undefined;

      const experience = experiences
        ? experiences.map((experience) => ({
            freelancerId: id,
            ...experience,
          }))
        : undefined;

      if (skills.length < 3) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Insert at least 3 Skills',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const response = await this.freelancerRepository.save({
        ...rest,
        id,
        skills,
      });
      await this.educationRepository.save(education);
      await this.experienceRepository.save(experience);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number) {
    await this.freelancerRepository.delete(id);
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
