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
  @Get('filter/:id')
  filter(
    @Param('id') userId: number,
    @Body() candidateFilterDto: CandidateFilterDto,
  ): Promise<Freelancer[]> {
    return this.clientService.filterCandidate(userId, candidateFilterDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('recently-viewed/:id')
  getRecentlyViewedFreelancer(@Param('id') userId: number) {
    return this.clientService.getRecentlyViewedFreelancer(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('view/:id')
  viewFreelancer(
    @Param('id') userId: number,
    @Body() { freelancerId }: ViewedFreelancerDto,
  ): Promise<Freelancer[]> {
    return this.clientService.viewFreelancer(userId, freelancerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('saved-freelancers/:id')
  getSavedFreelancers(@Param('id') userId: number): Promise<Freelancer[]> {
    return this.clientService.getSavedFreelancers(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('save/:id')
  saveFreelancer(
    @Param('id') userId: number,
    @Body() { freelancerId }: ViewedFreelancerDto,
  ): Promise<Freelancer[]> {
    return this.clientService.saveFreelancer(userId, freelancerId);
  }
}
