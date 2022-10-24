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
  Query,
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

  @UseGuards(JwtAuthGuard)
  @Get('by-freelancer-and-job-post')
  getOneByJobPostAndFreelancerUserIds(
    @Query() queryParams: CreateOfferDto,
  ): Promise<Offer> {
    try {
      return this.offerService.getOneByFreelancerIdAndJobPostId(
        queryParams.freelancerId,
        queryParams.jobPostId,
      );
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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req: AuthRequest,
  ): Promise<Offer> {
    try {
      return this.offerService.create(createOfferDto, req.user.id);
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
