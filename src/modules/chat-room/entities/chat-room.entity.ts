import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Offer } from 'src/modules/offer/entities/offer.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Offer)
  @JoinColumn({ name: 'offerId' })
  offer: Offer;
}
