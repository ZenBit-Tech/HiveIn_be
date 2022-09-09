import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { LocalFilesService } from './localFiles.service';
import { Response } from 'express';
import { JobPost } from './entities/job-post.entity';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { multerFileOptions } from 'src/config/multer.config';
import { SaveJobDraftDto } from './dto/save-job-draft.dto';

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
  ) {
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
  saveDraft(@Body() saveJobDraftDto: SaveJobDraftDto) {
    return this.jobPostService.saveDraft(saveJobDraftDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobPostDto: UpdateJobPostDto) {
    return this.jobPostService.update(+id, updateJobPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<JobPost[]> {
    return this.jobPostService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  findByUser(@Req() req: AuthRequest) {
    const { id } = req.user;
    return this.jobPostService.findByUser(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('home/self/:isDraft')
  getClientHomePostsAndDrafts(
    @Req() req: AuthRequest,
    @Param('isDraft') isDraft?: string,
  ) {
    const { id } = req.user;
    return this.jobPostService.getClientHomePostAndDrafts(
      id,
      isDraft === 'true' ? true : false,
    );
  }

  @Get('/file/:id')
  @UseGuards(JwtAuthGuard)
  async getFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { file, filename } = await this.localFilesService.sendFile(+id);
    res.set({
      'Content-Type': 'multipart/form-data',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return file;
  }
}
