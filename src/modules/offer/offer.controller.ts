import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { searchParamDto } from '../chat-room/dto/search-param.dto';
import { AuthRequest } from '../../utils/@types/AuthRequest';
import { OfferService } from './offer.service';
import { Offer } from './entities/offer.entity';
import { createOfferDto } from './dto/create-offer.dto';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @UseGuards(JwtAuthGuard)
  @Get('self')
  getAllOwn(@Request() req: AuthRequest): Promise<Offer[]> {
    return this.offerService.getAllOwn(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param() { id }: searchParamDto): Promise<Offer> {
    return this.offerService.getOneById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOfferDto: createOfferDto): Promise<Offer> {
    return this.offerService.create(createOfferDto);
  }
}
