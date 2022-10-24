import { Offer } from 'src/modules/offer/entities/offer.entity';

export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum tablesToSearch {
  USER = 'userFreelancer',
  FREELANCER = 'freelancer',
}

export interface IInfoForUpdateOffer {
  offer: Offer;
  clientId: number;
  freelancerUserId: number;
  chatRoomId: number;
}
