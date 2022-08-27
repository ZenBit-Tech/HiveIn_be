import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { Repository } from 'typeorm';
import { Skills } from './entities/skills.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    @InjectRepository(Skills)
    private readonly skillRepository: Repository<Skills>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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
    });
  }

  async findAll() {
    return await this.jobPostRepository.find({
      relations: ['category', 'skills'],
    });
  }

  async findOne(id: number) {
    return await this.jobPostRepository.findOne({
      where: { id: id },
      relations: ['category', 'skills'],
    });
  }

  async remove(id: number) {
    return await this.jobPostRepository.delete(id);
  }

  async addSkill(skill: { name: string }) {
    return await this.skillRepository.save(skill);
  }
  async addCategory(category: { name: string }) {
    return await this.categoryRepository.save(category);
  }
}
