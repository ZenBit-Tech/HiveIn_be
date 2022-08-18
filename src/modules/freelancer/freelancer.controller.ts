import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';

@Controller('freelancer')
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) {}

  @Post()
  create(@Body() createFreelancerDto: CreateFreelancerDto) {
    return this.freelancerService.create(createFreelancerDto);
  }

  @Get()
  findAll() {
    return this.freelancerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freelancerService.findOneByUserId(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreelancerDto: UpdateFreelancerDto,
  ) {
    return this.freelancerService.update(+id, updateFreelancerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freelancerService.remove(+id);
  }
}
