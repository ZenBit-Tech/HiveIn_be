import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { Repository } from 'typeorm';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { LocalFilesService } from './localFiles.service';
import { LocalFileDto } from './dto/localFile.dto';
import { LocalFile } from 'src/modules/entities/localFile.entity';
import { SaveJobDraftDto } from './dto/save-job-draft.dto';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private localFilesService: LocalFilesService,
  ) {}

  async save(
    createJobPostDto: CreateJobPostDto,
    fileData: LocalFileDto | null,
  ) {
    let file: LocalFile | null = null;

    if (fileData) {
      file = await this.localFilesService.saveLocalFileData(fileData);
    }

    const skills = createJobPostDto.skillsId?.map((value) => ({
      id: +value,
    }));
    return await this.jobPostRepository.save({
      id: createJobPostDto.id,
      title: createJobPostDto.title,
      duration: createJobPostDto.duration,
      durationType: createJobPostDto.durationType,
      jobDescription: createJobPostDto.jobDescription,
      rate: createJobPostDto.rate,
      englishLevel: createJobPostDto.englishLevel,
      isDraft: createJobPostDto.isDraft,
      skills: skills,
      category: createJobPostDto.categoryId,
      user: { id: createJobPostDto.userId },
      fileId: file?.id || null,
      contract: {},
    });
  }

  async saveDraft(saveJobDraftDto: SaveJobDraftDto) {
    return await this.jobPostRepository.save({
      id: saveJobDraftDto.id,
      title: saveJobDraftDto.title,
      duration: saveJobDraftDto.duration,
      durationType: saveJobDraftDto.durationType,
      jobDescription: saveJobDraftDto.jobDescription,
      rate: saveJobDraftDto.rate,
      englishLevel: saveJobDraftDto.englishLevel,
      isDraft: saveJobDraftDto.isDraft,
      skills: saveJobDraftDto.skillsId?.map((value) => ({
        id: +value,
      })),
      category: saveJobDraftDto.categoryId,
      user: { id: saveJobDraftDto.userId },
    });
  }

  async update(id: number, updateJobPostDto: UpdateJobPostDto) {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: id, user: { id: updateJobPostDto.userId } },
      relations: ['category', 'skills', 'user', 'contract'],
    });
    if (!jobPost) {
      throw new HttpException('job post not found', 404);
    }

    return await this.jobPostRepository.update(
      { user: { id: updateJobPostDto.userId }, id: id },
      {
        jobDescription: updateJobPostDto.jobDescription,
        rate: updateJobPostDto.rate,
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
      .leftJoinAndSelect('job_post.contract', 'contracts')
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
      relations: ['category', 'skills', 'user', 'contract'],
      order: {
        createdAt: 'DESC',
      },
    });
    if (!jobPosts) {
      throw new HttpException('Posts for this user not found', 404);
    }
    return jobPosts;
  }

  async getClientHomePostAndDrafts(userId: number, isDraft: boolean) {
    return await this.jobPostRepository.find({
      where: {
        user: {
          id: userId,
        },
        isDraft,
      },
      relations: ['contract'],
      order: {
        createdAt: 'DESC',
      },
      take: 2,
    });
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
