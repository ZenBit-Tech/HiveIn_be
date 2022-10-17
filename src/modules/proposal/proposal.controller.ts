import {
  Proposal,
  ProposalType,
} from 'src/modules/proposal/entities/proposal.entity';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Param,
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import { ProposalService } from 'src/modules/proposal/proposal.service';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':type')
  create(
    @Param('type') type: ProposalType,
    @Body() createProposalDto: CreateProposalDto,
  ): Promise<Proposal> {
    try {
      return this.proposalService.create(createProposalDto, type);
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
}
