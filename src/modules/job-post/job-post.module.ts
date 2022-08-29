import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost])],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
