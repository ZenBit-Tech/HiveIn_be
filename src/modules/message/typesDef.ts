export enum MessageType {
  FROM_USER = 'fromUser',
  FROM_SYSTEM = 'fromSystem',
  FROM_SYSTEM_OFFER = 'fromSystemOffer',
}

export interface ReturnedMessage {
  id: number;
  messageType: MessageType;
  senderId: number;
  text: string;
  created_at: Date;
}
