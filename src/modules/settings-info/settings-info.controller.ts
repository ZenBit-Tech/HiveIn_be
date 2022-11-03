import { DeleteResult } from 'typeorm';
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from '../entities/users.entity';

@ApiTags('Setting Info')
@Controller('settings-info')
export class SettingsInfoController {
  constructor(private readonly settingsInfoService: SettingsInfoService) {}

  @ApiCreatedResponse({
    description: 'Created settings',
    type: () => CreateSettingsInfoDto,
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSettingsInfoDto: CreateSettingsInfoDto) {
    return this.settingsInfoService.create(createSettingsInfoDto);
  }

  @ApiOkResponse({
    description: 'All settings info',
    type: [Users],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Users[]> {
    return this.settingsInfoService.findAll();
  }

  @ApiOkResponse({
    description: 'Self settings info',
    type: Users,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('self')
  findOwnUser(@Req() req: AuthRequest): Promise<Users> {
    const { id } = req.user;
    return this.settingsInfoService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'Self settings info by id',
    type: Users,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Users> {
    return this.settingsInfoService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'Self settings info was changed',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('self')
  update(
    @Req() req: AuthRequest,
    @Body() updateSettingsInfoDto: UpdateSettingsInfoDto,
  ): Promise<void> {
    const { id } = req.user;
    return this.settingsInfoService.update(+id, updateSettingsInfoDto);
  }

  @ApiOkResponse({
    description: 'Self settings info was deleted',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('self')
  remove(@Req() req: AuthRequest): Promise<DeleteResult> {
    const { id } = req.user;
    return this.settingsInfoService.remove(+id);
  }
}
