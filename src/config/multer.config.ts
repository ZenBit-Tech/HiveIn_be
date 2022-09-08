import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, promises } from 'fs';
import { diskStorage } from 'multer';

export const multerOptions: MulterOptions = {
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    if (file.mimetype.match(/\/(jpeg|jpg|png)$/)) done(null, true);
    else
      done(
        new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
        false,
      );
  },
  storage: diskStorage({
    async destination(
      req: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const uploadPath = process.env.UPLOADS_DIR;
      if (!existsSync(uploadPath))
        await promises.mkdir(uploadPath, { recursive: true });
      done(null, uploadPath);
    },
    filename(
      req: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const fileName = `${Date.now()}-${file.originalname}`;
      done(null, fileName);
    },
  }),
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
