import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Param,
  Logger,
  HttpException,
  InternalServerErrorException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Proposal,
  ProposalType,
} from 'src/modules/proposal/entities/proposal.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import { ProposalService } from 'src/modules/proposal/proposal.service';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { multerFileOptions } from 'src/config/multer.config';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Proposal')
@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @ApiCreatedResponse({
    description: 'Created proposal',
    type: () => Proposal,
  })
  @ApiUnprocessableEntityResponse({
    description: 'JobPost or freelancer with this id does not exist',
  })
  @ApiParam({
    name: 'type',
    required: true,
    enum: ProposalType,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':type')
  @UseInterceptors(FileInterceptor('file', multerFileOptions))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Param('type') type: ProposalType,
    @UploadedFile() file: Express.Multer.File,
    @Body() createProposalDto: CreateProposalDto,
    @Request() req: AuthRequest,
  ): Promise<Proposal> {
    try {
      if (file) {
        return this.proposalService.create(
          createProposalDto,
          req.user.id,
          type,
          {
            path: file.path,
            filename: file.originalname,
            mimetype: file.mimetype,
          },
        );
      }

      return this.proposalService.create(
        createProposalDto,
        req.user.id,
        type,
        null,
      );
    } catch (error) {
      Logger.error('Error occurred in offer controller (PATCH)');
      if (error instanceof HttpException)
        return Promise.reject(
          new HttpException(error.message, error.getStatus()),
        );
      if (error instanceof Error)
        return Promise.reject(new Error(error.message));
      return Promise.reject(new InternalServerErrorException());
    }
  }

  @ApiOkResponse({
    description: 'Freelancers proposals for job id',
    type: [Proposal],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('job-post/:jobId')
  getByJobId(
    @Request() req: AuthRequest,
    @Param('jobId') jobId: string,
  ): Promise<Proposal[]> {
    return this.proposalService.getProposalByJobId(req.user.id, jobId);
  }
}
