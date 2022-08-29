import { ClientService } from './client.service';
import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CandidateFilterDto } from './dto/candidate-filter.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('recently-viewed/:id')
  recentlyViewed(@Param('id') id: string) {
    return this.clientService.recentlyViewed(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('filter')
  filter(@Body() candidateFilterDto: CandidateFilterDto) {
    return this.clientService.filterCandidate(candidateFilterDto);
  }
}
