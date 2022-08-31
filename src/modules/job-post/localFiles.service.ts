import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalFile } from 'src/modules/entities/localFile.entity';
import { LocalFileDto } from './dto/localFile.dto';
import { join } from 'path';
import { createReadStream } from 'fs';
import * as fs from 'fs';

@Injectable()
export class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
  ) {}

  async saveLocalFileData(fileData: LocalFileDto) {
    const newFile = await this.localFilesRepository.create(fileData);
    await this.localFilesRepository.save(newFile);
    return newFile;
  }

  private async getFileById(fileId: number): Promise<LocalFile> {
    const file = await this.localFilesRepository.findOne({
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async sendFile(fileId: number) {
    const { path, filename } = await this.getFileById(fileId);
    const file = createReadStream(join(process.cwd(), path));
    return { file: new StreamableFile(file), filename };
  }

  async deleteFile(fileID: number) {
    const { path } = await this.getFileById(fileID);
    try {
      await fs.unlinkSync(path);
      return await this.localFilesRepository.delete({ id: fileID });
    } catch (e) {
      return e;
    }
  }
}
