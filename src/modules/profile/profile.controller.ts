import {
  Get,
  Controller,
  Post,
  Param,
  Delete,
  Put,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateProfileDto, ReplaceProfileDto } from './dto';
import { IProfile } from './profile.interface';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfileAll() {
    // It's a private controller
    const isUserAvailable = true;
    if (!isUserAvailable) {
      throw new HttpException('Not Authorized', 401);
    }

    return await this.profileService.findAll();
  }

  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    // It's a private controller
    const isUserAvailable = true;
    if (!isUserAvailable) {
      throw new HttpException('Not Authorized', 401);
    }
    return await this.profileService.findById(id);
  }

  @Post()
  async createProfile(@Body() profile: CreateProfileDto) {
    // It's a private controller
    const isUserAvailable = true;
    if (!isUserAvailable) {
      throw new HttpException('Not Authorized', 401);
    }
    return await this.profileService.add(profile);
    // return new Date();
  }

  @Delete(':id')
  async removeProfile(@Param('id') id: string) {
    // It's a private controller
    const isUserAvailable = true;
    if (!isUserAvailable) {
      throw new HttpException('Not Authorized', 401);
    }
    return await this.profileService.remove(id);
  }

  @Put(':id')
  async replaceProfile(
    @Param('id') id: string,
    @Body() profile: ReplaceProfileDto,
  ) {
    // It's a private controller
    const isUserAvailable = true;
    if (!isUserAvailable) {
      throw new HttpException('Not Authorized', 401);
    }
    return await this.profileService.replace(id, profile);
  }
}
