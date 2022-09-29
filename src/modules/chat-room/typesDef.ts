import { MessageType } from 'src/modules/message/typesDef';

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

interface IUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  avatarURL: string | null;
}

export interface IRoom {
  id: number;
  status: chatRoomStatus;
  freelancer: IUser;
  client: IUser;
  jobPost: {
    id: number;
    title: string;
  };
  lastMessage: {
    created_at: Date;
    id: number;
    messageType: MessageType;
    text: string;
  };
}
