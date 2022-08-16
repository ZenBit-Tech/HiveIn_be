import { Injectable } from '@nestjs/common';
import { CreateSettingsInfoDto } from './dto/create-settings-info.dto';
import { UpdateSettingsInfoDto } from './dto/update-settings-info.dto';

@Injectable()
export class SettingsInfoService {
  create(createSettingsInfoDto: CreateSettingsInfoDto) {
    return 'This action adds a new settingsInfo';
  }

  findAll() {
    return `This action returns all settingsInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} settingsInfo`;
  }

  update(id: number, updateSettingsInfoDto: UpdateSettingsInfoDto) {
    return `This action updates a #${id} settingsInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} settingsInfo`;
  }
}
