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
      isDraft: createJobPostDto.isDraft,
      skills: createJobPostDto.skillsId.map((value) => ({
        id: value,
      })),
      category: createJobPostDto.categoryId,
      user: { id: createJobPostDto.userId },
    });
  }

  async update(id: number, updateJobPostDto: UpdateJobPostDto) {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: id, user: { id: updateJobPostDto.userId } },
      relations: ['category', 'skills', 'user'],
    });
    if (!jobPost) {
      throw new HttpException('job post not found', 404);
    }
    return await this.jobPostRepository.update(
      { user: { id: updateJobPostDto.userId }, id: id },
      {
        jobDescription: updateJobPostDto.jobDescription,
        rate: updateJobPostDto.rate,
        isDraft: updateJobPostDto.isDraft,
      },
    );
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
      relations: ['category', 'skills', 'user'],
    });
  }

  async findByUser(userId: number) {
    return await this.jobPostRepository.find({
      where: { user: { id: userId } },
      relations: ['category', 'skills', 'user'],
    });
  }

  async getClientHomePostAndDrafts(userId: number, isDraft: boolean) {
    return await this.jobPostRepository.find({
      where: {
        user: {
          id: userId,
        },
        isDraft,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 2,
    });
  }

  async remove(id: number) {
    return await this.jobPostRepository.delete(id);
  }
}
