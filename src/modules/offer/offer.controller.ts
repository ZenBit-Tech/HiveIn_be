import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Offer')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiOkResponse({
    description: 'Self offers',
    type: [Offer],
  })
  @ApiInternalServerErrorResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('self')
  getAllOwn(@Request() req: AuthRequest): Promise<Offer[]> {
    try {
      return this.offerService.getAllOwn(req.user.id);
    } catch (error) {
      Logger.error('Error occurred in offer controller (GET)');
      if (error instanceof HttpException)
        return Promise.reject(
          new HttpException(error.message, error.getStatus()),
        );
      if (error instanceof Error)
        return Promise.reject(new Error(error.message));
      return Promise.reject(new InternalServerErrorException());
    }
  }

  @ApiOkResponse({
    description: 'Offer by room id',
    type: Offer,
  })
  @ApiInternalServerErrorResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param() { id }: searchParamDto): Promise<Offer> {
    try {
      return this.offerService.getOneById(+id);
    } catch (error) {
      Logger.error('Error occurred in offer controller (GET)');
      if (error instanceof HttpException)
        return Promise.reject(
          new HttpException(error.message, error.getStatus()),
        );
      if (error instanceof Error)
        return Promise.reject(new Error(error.message));
      return Promise.reject(new InternalServerErrorException());
    }
  }

  @ApiCreatedResponse({
    description: 'Offer was created',
    type: Offer,
  })
  @ApiNotAcceptableResponse({
    description: 'Offer to this user related to this job post already exist',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
  })
  @ApiInternalServerErrorResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOfferDto: CreateOfferDto): Promise<Offer> {
    try {
      return this.offerService.create(createOfferDto);
    } catch (error) {
      Logger.error('Error occurred in offer controller (POST)');
      if (error instanceof HttpException)
        return Promise.reject(
          new HttpException(error.message, error.getStatus()),
        );
      if (error instanceof Error)
        return Promise.reject(new Error(error.message));
      return Promise.reject(new InternalServerErrorException());
    }
  }

  @ApiOkResponse({
    description: 'Offer was updated',
    type: Offer,
  })
  @ApiNotFoundResponse({
    description: 'Offer not found',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
  })
  @ApiInternalServerErrorResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ): Promise<Offer> {
    try {
      return this.offerService.update(+id, updateOfferDto);
    } catch (error) {
      Logger.error('Error occurred in offer controller (PATCH)');
      if (error instanceof HttpException)
        return Promise.reject(
          new HttpException(error.message, error.getStatus()),
        );
      if (error instanceof Error)
        return Promise.reject(new Error(error.message));
      return Promise.reject(new InternalServerErrorException());
    }
  }
}
