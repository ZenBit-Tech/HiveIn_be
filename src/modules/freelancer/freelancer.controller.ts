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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Freelancer')
@Controller('freelancer')
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) {}

  @ApiCreatedResponse({
    description: 'Freelancer was created',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createFreelancerDto: CreateFreelancerDto,
  ): Promise<Freelancer> {
    return this.freelancerService.create(createFreelancerDto);
  }

  @ApiOkResponse({
    description: 'All freelancers',
    type: [Freelancer],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: AuthRequest): Promise<Freelancer[]> {
    return this.freelancerService.findAll(req.user.id);
  }

  @ApiOkResponse({
    description: 'Your freelancer entity',
    type: Freelancer,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('self')
  findOwn(@Req() req: AuthRequest): Promise<Freelancer> {
    const { id } = req.user;
    return this.freelancerService.findOneByUserId(+id);
  }

  @ApiOkResponse({
    description: 'Freelancer by id',
    type: Freelancer,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Freelancer> {
    return this.freelancerService.findOneByUserId(+id);
  }

  @ApiOkResponse({
    description: 'Freelancer by id was patched',
    type: Freelancer,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreelancerDto: UpdateFreelancerDto,
  ): Promise<Freelancer> {
    return this.freelancerService.update(+id, updateFreelancerDto);
  }

  @ApiOkResponse({
    description: 'Freelancer was deleted',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.freelancerService.remove(+id);
  }
}
