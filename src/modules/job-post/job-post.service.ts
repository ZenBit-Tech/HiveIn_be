import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { Repository } from 'typeorm';
import { UpdateJobPostDto } from './dto/update-job-post.dto';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
  ) {}

  async create(createJobPostDto: CreateJobPostDto) {
    return await this.jobPostRepository.save({
      title: createJobPostDto.title,
      duration: createJobPostDto.duration,
      durationType: createJobPostDto.durationType,
      jobDescription: createJobPostDto.jobDescription,
      rate: createJobPostDto.rate,
      englishLevel: createJobPostDto.englishLevel,
      skills: createJobPostDto.skillsId.map((value) => ({
        id: value,
      })),
      category: createJobPostDto.categoryId,
      user: { id: createJobPostDto.userId },
    });
  }

  async update(id: number, updateJobPostDto: UpdateJobPostDto) {
    debugger;
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: id, user: { id: updateJobPostDto.userId } },
      relations: ['category', 'skills', 'user'],
    });
    if (!jobPost) {
      debugger;
      throw new HttpException('job post not found', 404);
    } else {
      return await this.jobPostRepository.update(
        { user: { id: updateJobPostDto.userId }, id: id },
        {
          jobDescription: updateJobPostDto.jobDescription,
          rate: updateJobPostDto.rate,
        },
      );
    }
  }

  async findAll() {
    return await this.jobPostRepository
      .createQueryBuilder('job_post')
      .leftJoinAndSelect(
        'job_post.category',
        'category',
        'job_post.categoryId = category.id',
      )
      .leftJoinAndSelect('job_post.skills', 'skills')
      .leftJoinAndSelect('job_post.user', 'users')
      .getMany();
  }

  async findOne(id: number) {
    return await this.jobPostRepository.findOne({
      where: { id: id },
      relations: ['category', 'skills', 'users'],
    });
  }

  async findByUser(userId: number) {
    return await this.jobPostRepository.find({
      where: { user: { id: userId } },
      relations: ['category', 'skills', 'user'],
    });
  }

  async remove(id: number) {
    return await this.jobPostRepository.delete(id);
  }
}
