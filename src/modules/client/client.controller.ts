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
import { Freelancer } from '../freelancer/entities/freelancer.entity';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('filter/:id')
  filter(
    @Param('id') clientId: number,
    @Body() candidateFilterDto: CandidateFilterDto,
  ): Promise<Freelancer[]> {
    return this.clientService.filterCandidate(clientId, candidateFilterDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('recently-viewed/:id')
  getRecentlyViewedFreelancer(@Param('id') clientId: number) {
    return this.clientService.getRecentlyViewedFreelancer(clientId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('view/:clientId/:freelancerId')
  viewFreelancer(
    @Param('clientId') clientId: number,
    @Param('freelancerId') freelancerId: number,
  ): Promise<Freelancer[]> {
    return this.clientService.viewFreelancer(clientId, freelancerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('saved-freelancers/:id')
  getSavedFreelancers(@Param('id') clientId: number): Promise<Freelancer[]> {
    return this.clientService.getSavedFreelancers(clientId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('save/:clientId/:freelancerId')
  saveFreelancer(
    @Param('clientId') clientId: number,
    @Param('freelancerId') freelancerId: number,
  ): Promise<Freelancer[]> {
    return this.clientService.saveFreelancer(clientId, freelancerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('hired-freelancers/:id')
  getHiredFreelancers(@Param('id') clientId: number): Promise<Freelancer[]> {
    return this.clientService.getHiredFreelancers(clientId);
  }
}
