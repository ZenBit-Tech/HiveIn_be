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
