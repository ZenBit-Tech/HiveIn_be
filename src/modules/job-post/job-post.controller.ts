import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createJobPostDto: CreateJobPostDto) {
    return this.jobPostService.create(createJobPostDto);
  }

  @Post('skill')
  addSkill(@Body() skill: { name: string }) {
    return this.jobPostService.addSkill(skill);
  }
  @Post('category')
  addCategory(@Body() category: { name: string }) {
    return this.jobPostService.addCategory(category);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.jobPostService.findAll();
  }

  //@UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostService.findOne(+id);
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostService.remove(+id);
  }
}
