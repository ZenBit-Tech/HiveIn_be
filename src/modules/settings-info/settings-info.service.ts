import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, Users } from 'src/modules/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateSettingsInfoDto } from 'src/modules/settings-info/dto/create-settings-info.dto';
import { UpdateSettingsInfoDto } from 'src/modules/settings-info/dto/update-settings-info.dto';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';

@Injectable()
export class SettingsInfoService {
  constructor(
    @InjectRepository(Users)
    private readonly settingsInfoRepo: Repository<Users>,
    @InjectRepository(Freelancer)
    private freelancerRepository: Repository<Freelancer>,
  ) {}

  async create(createSettingsInfoDto: CreateSettingsInfoDto) {
    const { email } = createSettingsInfoDto;

    const currentUser = await this.settingsInfoRepo.findOneBy({ email: email });

    if (!currentUser) throw new NotFoundException();

    return await this.settingsInfoRepo.save({
      ...currentUser,
      ...createSettingsInfoDto,
    });
  }

  async findAll() {
    return await this.settingsInfoRepo.find();
  }

  async findOne(id: number) {
    return await this.settingsInfoRepo.findOneBy({ id: id });
  }

  async update(id: number, updateSettingsInfoDto: UpdateSettingsInfoDto) {
    const currentSettings = await this.findOne(id);

    if (!currentSettings) throw new NotFoundException();

    if (updateSettingsInfoDto.role === UserRole.FREELANCER) {
      const currentFreelancer = await this.freelancerRepository.findOneBy({
        userId: id,
      });
      if (!currentFreelancer)
        await this.freelancerRepository.save({
          userId: id,
          englishLevel: '',
          position: '',
          rate: '',
          category: { id: 1 },
        });
    }

    await this.settingsInfoRepo.save({ id, ...updateSettingsInfoDto });
  }

  async remove(id: number) {
    return await this.settingsInfoRepo.delete(id);
  }
}
