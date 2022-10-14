import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { ProposalType } from 'src/modules/proposal/entities/proposal.entity';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import { ProposalService } from 'src/modules/proposal/proposal.service';
import { InsertResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerFileOptions } from 'src/config/multer.config';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':type')
  @UseInterceptors(FileInterceptor('file', multerFileOptions))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Param('type') type: ProposalType,
    @UploadedFile() file: Express.Multer.File,
    @Body() createProposalDto: CreateProposalDto,
    @Request() req: AuthRequest,
  ): Promise<InsertResult> {
    if (file) {
      return this.proposalService.create(createProposalDto, req.user.id, type, {
        path: file.path,
        filename: file.originalname,
        mimetype: file.mimetype,
      });
    }

    return this.proposalService.create(
      createProposalDto,
      req.user.id,
      type,
      null,
    );
  }
}
