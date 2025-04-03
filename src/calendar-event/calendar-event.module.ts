import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEventController } from './calendar-event.controller';
import { CalendarEvent } from './entities/calendar-event.entity';
import { User } from '../user/entities/user.entity';
import { NagerClientModule } from '../nager-client/nager-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent, User]), NagerClientModule],
  controllers: [CalendarEventController],
  providers: [CalendarEventService],
})
export class CalendarEventModule {}
