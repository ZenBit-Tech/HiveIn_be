import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SettingsInfoService } from './settings-info.service';
import { CreateSettingsInfoDto } from './dto/create-settings-info.dto';
import { UpdateSettingsInfoDto } from './dto/update-settings-info.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/utils/@types/AuthRequest';

@Controller('settings-info')
export class SettingsInfoController {
  constructor(private readonly settingsInfoService: SettingsInfoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSettingsInfoDto: CreateSettingsInfoDto) {
    return this.settingsInfoService.create(createSettingsInfoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.settingsInfoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  findOwnUser(@Req() req: AuthRequest) {
    const { id } = req.user;
    return this.settingsInfoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsInfoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('self')
  update(
    @Req() req: AuthRequest,
    @Body() updateSettingsInfoDto: UpdateSettingsInfoDto,
  ) {
    const { id } = req.user;
    return this.settingsInfoService.update(+id, updateSettingsInfoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('self')
  remove(@Req() req: AuthRequest) {
    const { id } = req.user;
    return this.settingsInfoService.remove(+id);
  }
}
