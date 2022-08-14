import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Education } from './entities/education.entity';
import { Experiences } from './entities/experiences.enity';
import { Categories } from './entities/categories.entity';
import { ProfileSkills } from './entities/profile_skills.entity';
import { Skills } from './entities/skills.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      Education,
      Experiences,
      Categories,
      ProfileSkills,
      Skills,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
