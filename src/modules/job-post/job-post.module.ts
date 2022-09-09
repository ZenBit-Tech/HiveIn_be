import { Module } from '@nestjs/common';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { LocalFilesService } from './localFiles.service';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { LocalFile } from 'src/modules/entities/localFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, LocalFile, Contracts])],
  controllers: [JobPostController],
  providers: [JobPostService, LocalFilesService],
})
export class JobPostModule {}
