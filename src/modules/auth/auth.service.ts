import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/modules/entities/users.entity';
import { ForgotPassword } from 'src/modules/entities/forgot-password.entity';
import { AuthDto } from 'src/modules/auth/dto/auth.dto';
import { AuthRestorePasswordDto } from 'src/modules/auth/dto/restore-password.dto';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from 'src/utils/jwt.consts';
import { FilesService } from 'src/modules/file/file.service';

export interface ITokenPayload {
  id: number;
  email?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly authRepo: Repository<Users>,
    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepo: Repository<ForgotPassword>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private mailService: MailerService,
    private readonly filesService: FilesService,
  ) {}

  /* 
    When you are hashing your data the module will go through a series of rounds to give you a secure hash. 
    The value you submit here will be used to go through 2^rounds iterations of processing.
  */
  private saltRounds = 10;

  async signUp(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.authRepo.findOneBy({ email });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const salt = await genSalt(this.saltRounds);
    const hashPassword = await hash(password, salt);

    const createdUser = await this.authRepo.save({
      email,
      password: hashPassword,
    });

    const accessToken = await this.getJwtAccessToken(createdUser.id);
    const refreshToken = await this.getJwtRefreshToken(createdUser.id);

    await this.setCurrentRefreshToken(refreshToken, createdUser.id);

    return { accessToken, refreshToken };
  }

  async signIn(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.authRepo.findOneBy({ email });

    if (!user) throw new NotFoundException("User doesn't exist");

    if (user.googleId)
      throw new ConflictException('User should sign in through Google');

    const isMatch = await compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Password incorrect');

    const accessToken = await this.getJwtAccessToken(user.id);
    const refreshToken = await this.getJwtRefreshToken(user.id);

    await this.setCurrentRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  async getJwtAccessToken(id: number) {
    const { email, role } = await this.authRepo.findOneBy({ id });
    const payload: ITokenPayload = { id, email };

    return {
      authToken: this.jwtService.sign(payload, {
        secret: this.configService.get('SECRET_KEY'),
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      }),
      email,
      role,
    };
  }

  async getJwtRefreshToken(id: number) {
    const payload: ITokenPayload = { id };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_KEY'),
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.authRepo.findOneBy({ id });

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await hash(refreshToken, this.saltRounds);
    await this.authRepo.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    return this.authRepo.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async forgotPassword({ email }: AuthForgotPasswordDto) {
    const user = await this.authRepo.findOneBy({ email });

    if (user) {
      const userAbout = await this.getJwtAccessToken(user.id);

      await this.forgotPasswordRepo.save({
        user: user,
        link: userAbout.authToken,
      });

      const url =
        this.configService.get<string>('FRONTEND_RESTORE_PASSWORD_URL') +
        userAbout.authToken;

      await this.mailService.sendMail({
        to: email,
        subject: 'GetJob Forgot password',
        from: 'milkav06062003@gmail.com',
        html: `<h1>Change password</h1><p>If you want to change password go to:</p><a href="${url}">${url}</a>`,
      });

      return true;
    }
    return false;
  }

  async restorePassword({ password, token }: AuthRestorePasswordDto) {
    const forgotPassword = await this.forgotPasswordRepo.findOne({
      where: {
        link: token,
      },
      relations: {
        user: true,
      },
    });
    const salt = await genSalt(this.saltRounds);
    const updateUser = forgotPassword.user;
    updateUser.password = await hash(password, salt);
    const createdUser = await this.authRepo.save(updateUser);
    if (createdUser) {
      await this.forgotPasswordRepo.delete({
        link: token,
      });
    }
    return createdUser;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.authRepo.update(userId, {
      avatar,
    });
    return avatar;
  }
}
