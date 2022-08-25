import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { Category } from './entities/category.entity';
import { Skills } from './entities/skills.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, Category, Skills])],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
