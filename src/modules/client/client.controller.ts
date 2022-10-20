import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { ClientService } from './client.service';
import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as HttpRequest } from 'express';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
interface UserJwtPayload {
  id: number;
}

type AuthRequest = HttpRequest & { user: UserJwtPayload };

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // @ApiCreatedResponse({
  //   description: 'Filter freelancers',
  //   type: [Freelancer],
  // })
  @UseGuards(AuthGuard('jwt'))
  @Get('filter/:keyWords/:category/:skills')
  filter(
    @Request() req: AuthRequest,
    @Param('keyWords') keyWords: string,
    @Param('category') category: string,
    @Param('skills') skills: string,
  ): Promise<Freelancer[]> {
    return this.clientService.filterCandidate(req.user.id, {
      keyWords,
      category,
      skills,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('recently-viewed')
  getRecentlyViewedFreelancer(@Request() req: AuthRequest) {
    return this.clientService.getRecentlyViewedFreelancer(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('view/:freelancerId')
  viewFreelancer(
    @Request() req: AuthRequest,
    @Param('freelancerId') freelancerId: number,
  ): Promise<Freelancer[]> {
    return this.clientService.viewFreelancer(req.user.id, freelancerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('saved-freelancers')
  getSavedFreelancers(@Request() req: AuthRequest): Promise<Freelancer[]> {
    return this.clientService.getSavedFreelancers(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('save/:freelancerId')
  saveFreelancer(
    @Request() req: AuthRequest,
    @Param('freelancerId') freelancerId: number,
  ): Promise<Freelancer[]> {
    return this.clientService.saveFreelancer(req.user.id, freelancerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('hired-freelancers')
  getHiredFreelancers(@Request() req: AuthRequest): Promise<Freelancer[]> {
    return this.clientService.getHiredFreelancers(req.user.id);
  }
}
