import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { searchParamDto } from 'src/modules/chat-room/dto/search-param.dto';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { OfferService } from 'src/modules/offer/offer.service';
import { Offer } from 'src/modules/offer/entities/offer.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createOfferDto } from 'src/modules/offer/dto/create-offer.dto';

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
