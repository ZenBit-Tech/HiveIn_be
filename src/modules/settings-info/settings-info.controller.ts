import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SettingsInfoService } from './settings-info.service';
import { CreateSettingsInfoDto } from './dto/create-settings-info.dto';
import { UpdateSettingsInfoDto } from './dto/update-settings-info.dto';

@Controller('settings-info')
export class SettingsInfoController {
  constructor(private readonly settingsInfoService: SettingsInfoService) {}

  @Post()
  create(@Body() createSettingsInfoDto: CreateSettingsInfoDto) {
    return this.settingsInfoService.create(createSettingsInfoDto);
  }

  @Get()
  findAll() {
    return this.settingsInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsInfoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSettingsInfoDto: UpdateSettingsInfoDto,
  ) {
    return this.settingsInfoService.update(+id, updateSettingsInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsInfoService.remove(+id);
  }
}
