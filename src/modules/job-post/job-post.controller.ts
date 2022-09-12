import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JobPostService } from 'src/modules/job-post/job-post.service';
import { CreateJobPostDto } from 'src/modules/job-post/dto/create-job-post.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateJobPostDto } from 'src/modules/job-post/dto/update-job-post.dto';
import { LocalFilesService } from 'src/modules/job-post/localFiles.service';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { multerFileOptions } from 'src/config/multer.config';
import { SaveJobDraftDto } from 'src/modules/job-post/dto/save-job-draft.dto';
import { searchJobFiltersDto } from 'src/modules/job-post/dto/search-job-filters.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiTags('JobPost')
@Controller('job-post')
export class JobPostController {
  constructor(
    private readonly jobPostService: JobPostService,
    private readonly localFilesService: LocalFilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerFileOptions))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createJobPostDto: CreateJobPostDto,
  ): Promise<JobPost> {
    if (file) {
      return this.jobPostService.save(createJobPostDto, {
        path: file.path,
        filename: file.originalname,
        mimetype: file.mimetype,
      });
    }
    return this.jobPostService.save(createJobPostDto, null);
  }

  @Post('draft')
  saveDraft(@Body() saveJobDraftDto: SaveJobDraftDto): Promise<JobPost> {
    return this.jobPostService.saveDraft(saveJobDraftDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobPostDto: UpdateJobPostDto,
  ): Promise<UpdateResult> {
    return this.jobPostService.update(+id, updateJobPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<JobPost[]> {
    return this.jobPostService.findAll();
  }

  @Get('search-job')
  findAndFilterJobs(
    @Query() queryParams: searchJobFiltersDto,
  ): Promise<{ data: JobPost[]; totalCount: number }> {
    return this.jobPostService.findAndFilterAll(queryParams);
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  findByUser(@Req() req: AuthRequest): Promise<JobPost[]> {
    const { id } = req.user;
    return this.jobPostService.findByUser(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<JobPost> {
    return this.jobPostService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.jobPostService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('home/self/:isDraft')
  getClientHomePostsAndDrafts(
    @Req() req: AuthRequest,
    @Param('isDraft') isDraft?: string,
  ): Promise<JobPost[]> {
    const { id } = req.user;
    return this.jobPostService.getClientHomePostAndDrafts(
      id,
      isDraft === 'true',
    );
  }

  @Get('/file/:id')
  @UseGuards(JwtAuthGuard)
  async getFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { file, filename } = await this.localFilesService.sendFile(+id);
    res.set({
      'Content-Type': 'multipart/form-data',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return file;
  }
}
