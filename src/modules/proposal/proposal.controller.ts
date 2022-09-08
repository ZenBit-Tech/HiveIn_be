import { AuthRequest } from 'src/utils/types';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProposalService } from './proposal.service';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProposalDto: CreateProposalDto,
    @Request() req: AuthRequest,
  ) {
    return this.proposalService.create(createProposalDto, req.user.id);
  }
}
