import { Controller, Post } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';

@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  async create(createJobPostDto: CreateJobPostDto) {
    return await this.jobPostService.create(createJobPostDto);
  }
}
