import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities';

@Entity()
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column()
  countryCode: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.calendarEvents)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
