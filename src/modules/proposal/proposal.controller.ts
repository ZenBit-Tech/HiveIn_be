import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { ProposalType } from 'src/modules/proposal/entities/proposal.entity';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import { ProposalService } from 'src/modules/proposal/proposal.service';
import { InsertResult } from 'typeorm';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':type')
  create(
    @Param('type') type: ProposalType,
    @Body() createProposalDto: CreateProposalDto,
    @Request() req: AuthRequest,
  ): Promise<InsertResult> {
    return this.proposalService.create(createProposalDto, req.user.id, type);
  }
}
