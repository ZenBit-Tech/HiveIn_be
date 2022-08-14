import {
  Get,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto, ReplaceProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findAll() {
    const allProfiles = await this.profileRepository.find();
    return allProfiles;
  }

  async findById(_id: string) {
    const result = await this.profileRepository.findOne({
      where: { id: Number(_id) },
    });
    if (!result) {
      throw new HttpException('Not Found', 404);
    }
    return result;
  }

  async add(CreateProfileDto: CreateProfileDto) {
    const profile = JSON.parse(JSON.stringify(CreateProfileDto));
    profile.createdAt = new Date();
    profile.updatedAt = profile.createdAt;
    try {
      return await this.profileRepository.save(profile);
    } catch (error) {
      throw new HttpException('Post Request is corrupted', 500);
    }
  }

  async remove(_id: string) {
    const profileToDelete = await this.profileRepository.findOne({
      where: { id: Number(_id) },
    });
    if (!profileToDelete) {
      throw new HttpException('Not Found', 404);
    }
    try {
      return await this.profileRepository.delete(Number(_id));
    } catch (error) {
      throw new HttpException('Delete Request is corrupted', 500);
    }
  }

  async replace(_id: string, ReplaceProfileDto: ReplaceProfileDto) {
    const profileToReplace = await this.profileRepository.findOne({
      where: { id: Number(_id) },
    });
    if (!profileToReplace) {
      throw new HttpException('Not Found', 404);
    }
    const profile = JSON.parse(JSON.stringify(ReplaceProfileDto));
    try {
      return await this.profileRepository.update(Number(_id), profile);
    } catch (error) {
      throw new HttpException('Put Request is corrupted', 500);
    }
  }
}
