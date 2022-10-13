import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { CreateJobPostDto } from 'src/modules/job-post/dto/create-job-post.dto';
import { UpdateJobPostDto } from 'src/modules/job-post/dto/update-job-post.dto';
import { LocalFilesService } from 'src/modules/job-post/localFiles.service';
import { LocalFileDto } from 'src/modules/job-post/dto/localFile.dto';
import { LocalFile } from 'src/modules/entities/localFile.entity';
import { SaveJobDraftDto } from 'src/modules/job-post/dto/save-job-draft.dto';
import { searchJobFiltersDto } from 'src/modules/job-post/dto/search-job-filters.dto';
import {
  DEFAULT_AMOUNT_OF_QUERIED_POSTS,
  DEFAULT_SKIP_OF_QUERIED_POSTS,
} from 'src/utils/job-post.consts';

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
  ): Promise<JobPost> {
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

  async saveDraft(saveJobDraftDto: SaveJobDraftDto): Promise<JobPost> {
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

  async update(
    id: number,
    updateJobPostDto: UpdateJobPostDto,
  ): Promise<UpdateResult> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: id, user: { id: updateJobPostDto.userId } },
      relations: ['category', 'skills', 'user', 'offer'],
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

  async findAll(): Promise<JobPost[]> {
    return await this.jobPostRepository
      .createQueryBuilder('job_post')
      .leftJoinAndSelect(
        'job_post.category',
        'category',
        'job_post.categoryId = category.id',
      )
      .leftJoinAndSelect('job_post.skills', 'skills')
      .leftJoinAndSelect('job_post.user', 'users')
      .leftJoinAndSelect('job_post.offer', 'offer')
      .getMany();
  }

  async findAndFilterAll(
    queryParams: searchJobFiltersDto,
  ): Promise<{ data: JobPost[]; totalCount: number }> {
    const {
      category,
      skills,
      englishLevel,
      duration,
      durationType,
      rate,
      keyWord,
    } = queryParams;
    const take = queryParams.take || DEFAULT_AMOUNT_OF_QUERIED_POSTS;
    const skip = queryParams.skip || DEFAULT_SKIP_OF_QUERIED_POSTS;

    const filterSkillsParams =
      skills &&
      skills.split('_').map((skillId) => {
        if (!Number.isInteger(+skillId))
          throw new HttpException('Unacceptable skill query parameter', 400);
        return +skillId;
      });

    const [data, totalCount] = await this.jobPostRepository
      .createQueryBuilder('job_post')
      .leftJoinAndSelect(
        'job_post.category',
        'category',
        'job_post.categoryId = category.id',
      )
      .leftJoinAndSelect('job_post.skills', 'skills')
      .leftJoinAndSelect('job_post.user', 'users')
      .where('isDraft = 0')
      .andWhere(category ? `job_post.categoryId = ${category}` : '1 = 1')
      .andWhere(englishLevel ? `englishLevel = '${englishLevel}'` : '1 = 1')
      .andWhere(duration ? `duration <= ${duration}` : '1 = 1')
      .andWhere(
        durationType && duration ? `durationType = '${durationType}'` : '1 = 1',
      )
      .andWhere(rate ? `rate >= ${rate}` : '1 = 1')
      .andWhere(skills ? `skills.id IN (${filterSkillsParams})` : '1 = 1')
      .andWhere(
        keyWord
          ? `(job_post.title LIKE '%${keyWord}%' OR job_post.jobDescription LIKE '%${keyWord}%')`
          : '1 = 1',
      )
      .orderBy(`job_post.createdAt`, 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      data,
      totalCount,
    };
  }

  async findOne(id: number): Promise<JobPost> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: id },
      relations: ['category', 'skills', 'user', 'file', 'offer'],
    });
    if (!jobPost) {
      throw new HttpException('Job post not found', 404);
    }
    return jobPost;
  }

  async findByUser(userId: number, isDraft: boolean): Promise<JobPost[]> {
    const jobPosts = await this.jobPostRepository
      .createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoinAndSelect('jobPost.offer', 'offer')
      .where({ user: { id: userId }, isDraft })
      .orderBy('jobPost.createdAt', 'DESC')
      .getMany();

    if (!jobPosts) throw new NotFoundException();

    return jobPosts;
  }

  async getClientHomePostAndDrafts(
    userId: number,
    isDraft: boolean,
  ): Promise<JobPost[]> {
    return await this.jobPostRepository.find({
      where: {
        user: {
          id: userId,
        },
        isDraft,
      },
      relations: ['offer'],
      order: {
        createdAt: 'DESC',
      },
      take: 2,
    });
  }

  async getOwnerIdByPostId(id: number): Promise<number> {
    try {
      const jobPost = await this.jobPostRepository
        .createQueryBuilder('jobPost')
        .leftJoinAndSelect('jobPost.user', 'user')
        .where('jobPost.id = :id', { id })
        .getOne();

      if (!jobPost) throw new NotFoundException();
      return jobPost.user.id;
    } catch (error) {
      Logger.error('Error occurred while trying to get job post from db');
      if (error instanceof NotFoundException) throw new NotFoundException();
      throw new UnprocessableEntityException();
    }
  }

  async remove(id: number): Promise<DeleteResult> {
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
