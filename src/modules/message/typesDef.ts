export interface ReturnedMessage {
  id: number;
  isSystemMessage: boolean;
  senderId: number;
  text: string;
  created_at: Date;
}
