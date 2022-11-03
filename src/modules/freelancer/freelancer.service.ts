import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from 'src/modules/freelancer/entities/education.entity';
import { Experience } from 'src/modules/freelancer/entities/experience.entity';
import { CreateFreelancerDto } from 'src/modules/freelancer/dto/create-freelancer.dto';
import { UpdateFreelancerDto } from 'src/modules/freelancer/dto/update-freelancer.dto';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Users } from 'src/modules/entities/users.entity';
import { ClientService } from 'src/modules/client/client.service';

@Injectable()
export class FreelancerService {
  constructor(
    @InjectRepository(Freelancer)
    private freelancerRepository: Repository<Freelancer>,
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly clientService: ClientService,
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
      rate: data.rate,
      userId: data.userId,
      skills: skills,
      experience: data.experiences,
      education: data.educations,
      user: data.user,
    });
  }

  async findAll(userId: number): Promise<Freelancer[]> {
    return await this.clientService.addSavesField(
      userId,
      await this.freelancerRepository
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
        .leftJoinAndSelect('freelancer.user', 'user')
        .leftJoinAndSelect('user.avatar', 'avatar')
        .getMany(),
    );
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
      .leftJoinAndSelect('freelancer.user', 'user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where(`freelancer.userId = ${id}`)
      .getOne();
  }

  async getUserIdByFreelancerId(id: number): Promise<number> {
    try {
      const freelancer = await this.freelancerRepository
        .createQueryBuilder('freelancer')
        .select('freelancer.userId')
        .where('freelancer.id = :id', { id })
        .getOne();

      if (!freelancer) throw new NotFoundException();

      return freelancer.userId;
    } catch (error) {
      Logger.error('Error occurred while trying to get user from db');
      if (error instanceof NotFoundException) throw new NotFoundException();
      throw new UnprocessableEntityException();
    }
  }

  async update(id: number, data: UpdateFreelancerDto): Promise<Freelancer> {
    try {
      const { educations, experiences, skillsIds, user, ...rest } = data;
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
        user,
      });
      await this.educationRepository.save(education);
      await this.experienceRepository.save(experience);
      await this.usersRepository.save(user);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number): Promise<void> {
    await this.freelancerRepository.delete(id);
  }
}
