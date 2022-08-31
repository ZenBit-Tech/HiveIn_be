import { ClientService } from './client.service';
import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CandidateFilterDto } from './dto/candidate-filter.dto';
import { ViewedFreelancerDto } from './dto/viewedFreelancer.dto';
import { Freelancer } from '../freelancer/entities/freelancer.entity';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('recently-viewed/:id')
  recentlyViewed(@Param('id') userId: number): Promise<Freelancer[]> {
    return this.clientService.recentlyViewed(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('filter')
  filter(
    @Body() candidateFilterDto: CandidateFilterDto,
  ): Promise<Freelancer[]> {
    return this.clientService.filterCandidate(candidateFilterDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('view/:id')
  view(
    @Param('id') userId: number,
    @Body() { freelancerId }: ViewedFreelancerDto,
  ): Promise<Freelancer[]> {
    return this.clientService.view(userId, freelancerId);
  }
}
