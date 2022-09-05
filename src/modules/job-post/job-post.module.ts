import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { LocalFilesService } from './localFiles.service';
import { LocalFile } from '../entities/localFile.entity';
import { JobPostQuestion } from './entities/job-post-question.entity';
import { FreelancerAnswer } from './entities/freelancer-answer.entity';
import { JobPostQuestionService } from './job-post-question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobPost,
      JobPostQuestion,
      LocalFile,
      FreelancerAnswer,
    ]),
  ],
  controllers: [JobPostController],
  providers: [JobPostService, LocalFilesService, JobPostQuestionService],
})
export class JobPostModule {}
