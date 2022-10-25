import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { FilteredJobsDto } from './dto/filter-job-post.dto';

@ApiTags('JobPost')
@Controller('job-post')
export class JobPostController {
  constructor(
    private readonly jobPostService: JobPostService,
    private readonly localFilesService: LocalFilesService,
  ) {}

  @ApiCreatedResponse({
    description: 'Created job posts',
    type: JobPost,
  })
  @ApiBearerAuth()
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

  @ApiCreatedResponse({
    description: 'Created draft',
    type: JobPost,
  })
  @ApiBearerAuth()
  @Post('draft')
  saveDraft(@Body() saveJobDraftDto: SaveJobDraftDto): Promise<JobPost> {
    return this.jobPostService.saveDraft(saveJobDraftDto);
  }

  @ApiNotFoundResponse({
    description: 'job post not found',
  })
  @ApiOkResponse({
    description: 'Job post was updated',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobPostDto: UpdateJobPostDto,
  ): Promise<UpdateResult> {
    return this.jobPostService.update(+id, updateJobPostDto);
  }

  @ApiOkResponse({
    description: 'All job posts',
    type: [JobPost],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<JobPost[]> {
    return this.jobPostService.findAll();
  }

  @ApiOkResponse({
    description: 'Filtered job posts',
    type: FilteredJobsDto,
  })
  @ApiBearerAuth()
  @Get('search-job')
  findAndFilterJobs(
    @Query() queryParams: searchJobFiltersDto,
  ): Promise<FilteredJobsDto> {
    return this.jobPostService.findAndFilterAll(queryParams);
  }

  @ApiOkResponse({
    description: 'My drafts',
    type: [JobPost],
  })
  @ApiNotFoundResponse({
    description: 'Job posts not found',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('self')
  findByUser(
    @Req() req: AuthRequest,
    @Param('isDraft', ParseBoolPipe) isDraft?: boolean,
  ): Promise<JobPost[]> {
    const { id } = req.user;
    return this.jobPostService.findByUser(+id, isDraft);
  }

  @ApiOkResponse({
    description: 'My drafts or job posts',
    type: [JobPost],
  })
  @ApiNotFoundResponse({
    description: 'Job posts not found',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('self/:isDraft')
  findByUserDraft(
    @Req() req: AuthRequest,
    @Param('isDraft', ParseBoolPipe) isDraft?: boolean,
  ): Promise<JobPost[]> {
    const { id } = req.user;
    return this.jobPostService.findByUser(+id, isDraft);
  }

  @ApiOkResponse({
    description: 'Job post by this id',
    type: JobPost,
  })
  @ApiNotFoundResponse({
    description: 'Job post not found',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<JobPost> {
    return this.jobPostService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.jobPostService.remove(+id);
  }

  @ApiOkResponse({
    description: 'Job post by this id was deleted',
  })
  @ApiNotFoundResponse({
    description: 'Job post not found',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('home/self/:isDraft')
  getClientHomePostsAndDrafts(
    @Req() req: AuthRequest,
    @Param('isDraft', ParseBoolPipe) isDraft?: boolean,
  ): Promise<JobPost[]> {
    const { id } = req.user;
    return this.jobPostService.getClientHomePostAndDrafts(id, isDraft);
  }

  @ApiOkResponse({
    description: 'File was uploaded',
  })
  @ApiBearerAuth()
  @Get('/file/:id')
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
