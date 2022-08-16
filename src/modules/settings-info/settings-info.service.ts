import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsInfo } from 'src/modules/settings-info/entities/settings-info.entity';
import { Repository } from 'typeorm';
import { CreateSettingsInfoDto } from './dto/create-settings-info.dto';
import { UpdateSettingsInfoDto } from './dto/update-settings-info.dto';

@Injectable()
export class SettingsInfoService {
  constructor(
    @InjectRepository(SettingsInfo)
    private readonly settingsInfoRepo: Repository<SettingsInfo>,
  ) {}

  async create(createSettingsInfoDto: CreateSettingsInfoDto) {
    return await this.settingsInfoRepo.save(createSettingsInfoDto);
  }

  async findAll() {
    return await this.settingsInfoRepo.find();
  }

  async findOne(id: number) {
    return await this.settingsInfoRepo.findOneBy({ id: id });
  }

  async update(id: number, updateSettingsInfoDto: UpdateSettingsInfoDto) {
    const currentSettings = await this.findOne(id);

    if (!currentSettings) return null;

    return await this.settingsInfoRepo.save({
      ...currentSettings,
      ...updateSettingsInfoDto,
    });
  }

  async remove(id: number) {
    return await this.settingsInfoRepo.delete(id);
  }
}
