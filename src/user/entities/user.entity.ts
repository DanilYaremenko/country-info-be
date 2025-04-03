import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CalendarEvent } from '../../calendar-event/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => CalendarEvent, (event) => event.user)
  calendarEvents: CalendarEvent[];
}
