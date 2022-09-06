import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProposalService } from './proposal.service';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProposalDto: CreateProposalDto) {
    return this.proposalService.create(createProposalDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.proposalService.findOne(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.proposalService.remove(id);
  // }
}
