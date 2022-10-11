import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';

export const multerAvatarOptions: MulterOptions = {
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    if (!file.mimetype.match(/\/(jpeg|jpg|png)$/)) {
      done(
        new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
        false,
      );
    }

    if (file.size > 5e6) {
      done(
        new BadRequestException(
          `The maximum file size has been exceeded. Please select a file smaller than 5MB`,
        ),
        null,
      );
    }

    done(null, true);
  },
};

export const multerFileOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploadedFiles/files',
  }),
  limits: { files: 1 },
  fileFilter: (req, { mimetype, size }, cb) => {
    const _mimeTypes: string[] = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'text/plain',
    ];
    if (!_mimeTypes.includes(mimetype)) {
      cb(
        new BadRequestException(
          `Only the following file types are accepted: ${_mimeTypes}`,
        ),
        null,
      );
    }
    if (size > 5e6) {
      cb(
        new BadRequestException(
          `The maximum file size has been exceeded. Please select a file smaller than 5MB`,
        ),
        null,
      );
    }
    cb(null, true);
  },
};
