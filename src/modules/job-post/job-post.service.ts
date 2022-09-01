import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { Repository } from 'typeorm';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { LocalFilesService } from './localFiles.service';
import { LocalFileDto } from './dto/localFile.dto';
import { LocalFile } from '../entities/localFile.entity';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private localFilesService: LocalFilesService,
  ) {}

  async create(
    createJobPostDto: CreateJobPostDto,
    fileData: LocalFileDto | null,
  ) {
    let file: LocalFile | null = null;

    if (fileData) {
      file = await this.localFilesService.saveLocalFileData(fileData);
    }
    const skills = createJobPostDto.skillsId.map((value) => ({
      id: +value,
    }));
    /*TODO type validation*/
    return await this.jobPostRepository.save({
      title: createJobPostDto.title,
      duration: +createJobPostDto.duration,
      durationType: createJobPostDto.durationType,
      jobDescription: createJobPostDto.jobDescription,
      rate: +createJobPostDto.rate,
      englishLevel: createJobPostDto.englishLevel,
      isDraft: createJobPostDto.isDraft,
      skills: skills,
      category: createJobPostDto.categoryId,
      user: { id: +createJobPostDto.userId },
      fileId: file?.id || null,
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
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: id },
      relations: ['category', 'skills', 'user', 'file'],
    });
    if (!jobPost) {
      throw new HttpException('Job post not found', 404);
    }
    return jobPost;
  }

  async findByUser(userId: number) {
    const jobPosts = await this.jobPostRepository.find({
      where: { user: { id: userId } },
      relations: ['category', 'skills', 'user'],
    });
    if (!jobPosts) {
      throw new HttpException('Posts for this user not found', 404);
    }
    return jobPosts;
  }

  async remove(id: number) {
    const jobPost = await this.findOne(id);
    if (!jobPost) {
      throw new HttpException('Job post not found', 404);
    }
    const status = await this.jobPostRepository.delete({ id: id });
    if (jobPost.fileId) {
      await this.localFilesService.deleteFile(jobPost.fileId);
    }
    return status;
  }
}
