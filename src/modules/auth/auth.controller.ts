import { UpdateResult } from 'typeorm';
import {
  Body,
  Controller,
  Request,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Patch,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/modules/auth/guards/jwt-refresh.guard';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { AuthRestorePasswordDto } from './dto/restore-password.dto';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { FileInterceptor } from '@nestjs/platform-express';
import PublicFile from 'src/modules/file/entities/publicFile.entity';
import { multerAvatarOptions } from 'src/config/multer.config';
import { Users } from 'src/modules/entities/users.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  @ApiOkResponse({
    type: 'Your email, email@gmail.com',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('private')
  privateRoute(@Request() req): string {
    return `Your email, ${req.user.email}`;
  }

  @ApiCreatedResponse({
    description: 'Created user',
  })
  @ApiBadRequestResponse({
    description: 'User cannot register. Try again',
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @Post('sign-up')
  async signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @ApiConflictResponse({ description: 'User should sign in through Google' })
  @ApiNotFoundResponse({
    description: 'User does not exist',
  })
  @ApiCreatedResponse({
    description: 'User login successfully',
  })
  @Post('sign-in')
  async signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @ApiUnauthorizedResponse({
    description: 'User did not login',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('log-out')
  async logOut(@Req() req: AuthRequest): Promise<UpdateResult> {
    return await this.authService.removeRefreshToken(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: AuthRequest) {
    return this.authService.getJwtAccessToken(req.user.id);
  }

  @ApiBody({
    description: 'Forgot password',
    type: AuthForgotPasswordDto,
  })
  @ApiOkResponse({
    description:
      'If response true - link was sent to email. If response false - it means that user sing up with Google account',
  })
  @ApiBadRequestResponse({
    description: 'Error with schema',
  })
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: AuthForgotPasswordDto): Promise<boolean> {
    return this.authService.forgotPassword(dto);
  }

  @ApiBody({
    description: 'Restore password',
    type: AuthRestorePasswordDto,
  })
  @ApiOkResponse({
    description: 'Password was changed',
    type: Users,
  })
  @ApiNotFoundResponse({
    description: 'User does not exist',
  })
  @ApiBadRequestResponse({
    description: 'Error with schema',
  })
  @HttpCode(200)
  @Patch('restore-password')
  async restorePassword(@Body() dto: AuthRestorePasswordDto): Promise<Users> {
    return this.authService.restorePassword(dto);
  }

  @ApiBearerAuth()
  @ApiBody({
    description: 'Avatar file',
    type: FileUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', multerAvatarOptions))
  async addAvatar(
    @Req() request: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PublicFile> {
    return this.authService.addAvatar(
      request.user,
      file.buffer,
      file.originalname,
    );
  }

  @ApiCreatedResponse({
    description: 'User avatar was deleted',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('removeAvatar')
  async removeAvatar(@Req() request: AuthRequest): Promise<void> {
    return this.authService.deleteAvatar(request.user.id);
  }
}
