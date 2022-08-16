import { PartialType } from '@nestjs/mapped-types';
import { CreateSettingsInfoDto } from './create-settings-info.dto';

export class UpdateSettingsInfoDto extends PartialType(CreateSettingsInfoDto) {}
