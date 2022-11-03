import { Message } from 'src/modules/message/entities/message.entity';
import { Status } from 'src/modules/offer/typesDef';

export enum ColumnNames {
  CLIENT = 'client_user_profile',
  FREELANCER = 'freelancer_user_profile',
  CHAT_ROOM = 'chat_room',
  JOB_POST = 'job_post',
}

export type TArgs = {
  columnName: ColumnNames;
  id: number;
};

export enum chatRoomStatus {
  FOR_ALL = 'forAll',
  FREELANCER_ONLY = 'freelancerOnly',
  CLIENT_ONLY = 'clientOnly',
}

export interface IUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  avatarURL: string | null;
}

export interface IFreelancer extends IUser {
  freelancerId: number;
}

export interface IChatRoom {
  id: number;
  title: string;
}

export interface IRoom {
  id: number;
  status: chatRoomStatus;
  freelancer: IFreelancer;
  client: IUser;
  jobPost: IChatRoom;
  lastMessage: Message;
  offerStatus?: Status;
}
