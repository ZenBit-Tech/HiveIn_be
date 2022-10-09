import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { searchParamDto } from 'src/modules/chat-room/dto/search-param.dto';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { OfferService } from 'src/modules/offer/offer.service';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { CreateOfferDto } from 'src/modules/offer/dto/create-offer.dto';
import { UpdateOfferDto } from 'src/modules/offer/dto/update-offer.dto';

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
  create(@Body() createOfferDto: CreateOfferDto): Promise<Offer> {
    return this.offerService.create(createOfferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ): Promise<Offer> {
    return this.offerService.update(+id, updateOfferDto);
  }
}
