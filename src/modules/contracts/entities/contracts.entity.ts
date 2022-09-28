import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from 'src/modules/offer/entities/offer.entity';

@Entity()
export class Contracts {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Offer)
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;
}
