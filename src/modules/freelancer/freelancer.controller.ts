import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { Freelancer } from './entities/freelancer.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/utils/@types/AuthRequest';

@Controller('freelancer')
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createFreelancerDto: CreateFreelancerDto,
  ): Promise<Freelancer> {
    return this.freelancerService.create(createFreelancerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: AuthRequest): Promise<Freelancer[]> {
    return this.freelancerService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  findOwn(@Req() req: AuthRequest): Promise<Freelancer> {
    const { id } = req.user;
    return this.freelancerService.findOneByUserId(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Freelancer> {
    return this.freelancerService.findOneByUserId(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreelancerDto: UpdateFreelancerDto,
  ): Promise<Freelancer> {
    return this.freelancerService.update(+id, updateFreelancerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.freelancerService.remove(+id);
  }
}
