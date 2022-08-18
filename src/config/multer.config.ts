import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
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
    destination(
      req: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const uploadPath = process.env.UPLOADS_DIR;
      !existsSync(uploadPath) && mkdirSync(uploadPath);
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
