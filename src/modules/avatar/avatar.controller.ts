import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { of } from 'rxjs';
import { avatarLink, uploadsDir } from 'src/utils/avatar.consts';
import { multerOptions } from '../../config/multer.config';

@Controller('avatar')
export class AvatarController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  photoUpload(@UploadedFile() file: Express.Multer.File) {
    /*TODO replace with __dirname*/
    return `${avatarLink}/${file.filename}`;
  }

  @Get(':imgurl')
  getPhoto(@Param('imgurl') imgUrl, @Res() res) {
    return of(res.sendFile(join(process.cwd(), `${uploadsDir}/${imgUrl}`)));
  }
}
