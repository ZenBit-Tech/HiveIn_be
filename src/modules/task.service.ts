import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CHAT } from '../utils/auth.consts';
import { ChatRoom } from './chat-room/entities/chat-room.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE) //EVERY_DAY_AT_NOON
  async some() {
    const dateAfterWeek = new Date(
      new Date().setDate(new Date().getDate() + 7),
    );

    const rooms = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .where(
        `chatRoom.deleteDate BETWEEN ${this.dateToSQLDate(
          dateAfterWeek,
        )} AND ${this.dateToSQLDate(
          new Date(dateAfterWeek.setDate(dateAfterWeek.getDate() + 1)),
        )}`,
      )
      .getMany();

    this.sendProlongEmailToUsers(rooms);

    const today = new Date();

    await this.chatRoomRepository
      .createQueryBuilder()
      .delete()
      .from(ChatRoom)
      .where(
        `deleteDate BETWEEN ${this.dateToSQLDate(
          today,
        )} AND ${this.dateToSQLDate(this.nextDate(today))}`,
      )
      .execute();
  }

  dateToSQLDate(date: Date): string {
    return `"${date.toLocaleDateString().split('.').reverse().join('-')}"`;
  }

  nextDate(date: Date): Date {
    return new Date(date.setDate(date.getDate() + 1));
  }

  sendProlongEmailToUsers(rooms: ChatRoom[]) {
    rooms.forEach(
      async ({
        jobPost: {
          user: { email },
        },
        id,
        deleteDate,
        prolongLink,
      }) => {
        const chatUrl =
          this.configService.get<string>('FRONTEND_SIGN_IN_REDIRECT_URL') +
          CHAT +
          '/' +
          id;
        await this.mailService.sendMail({
          to: email,
          subject: 'GetJob Delete Chat',
          from: 'milkav06062003@gmail.com',
          html: `<h1>Hello</h1><h1>Your chat will be automatically deleted in ${deleteDate}</h1>
          <ul>
          <li><a href="${chatUrl}">Go to chat</a></li>
          <li><a href="${chatUrl}?prolong=${prolongLink}">Prolong chat</a></li>
          </ul>`,
        });
      },
    );
  }
}
