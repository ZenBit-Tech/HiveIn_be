import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { Experience } from './entities/experience.entity';
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
  async create(data: CreateFreelancerDto): Promise<Freelancer> {
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
      description: data.description,
      rate: data.rate,
      userId: data.userId,
      skills: skills,
      experience: data.experiences,
      education: data.educations,
    });
  }

  async findAll(): Promise<Freelancer[]> {
    return this.freelancerRepository
      .createQueryBuilder('freelancer')
      .leftJoinAndSelect(
        'freelancer.education',
        'education',
        'freelancer.id = education.freelancerId AND education.active = true',
      )
      .leftJoinAndSelect(
        'freelancer.experience',
        'experience',
        'freelancer.id = experience.freelancerId AND experience.active = true',
      )
      .leftJoinAndSelect(
        'freelancer.category',
        'category',
        'freelancer.categoryId = category.id',
      )
      .leftJoinAndSelect('freelancer.skills', 'skill')
      .getMany();
  }

  findOneByUserId(id: number): Promise<Freelancer> {
    return this.freelancerRepository
      .createQueryBuilder('freelancer')
      .leftJoinAndSelect(
        'freelancer.education',
        'education',
        'freelancer.id = education.freelancerId AND education.active = true',
      )
      .leftJoinAndSelect(
        'freelancer.experience',
        'experience',
        'freelancer.id = experience.freelancerId AND experience.active = true',
      )
      .leftJoinAndSelect(
        'freelancer.category',
        'category',
        'freelancer.categoryId = category.id',
      )
      .leftJoinAndSelect('freelancer.skills', 'skill')
      .where(`freelancer.userId = ${id}`)
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

  async remove(id: number): Promise<void> {
    await this.freelancerRepository.delete(id);
  }
}
