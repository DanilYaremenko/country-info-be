import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEvent } from './entities/calendar-event.entity';
import { AddHolidaysDto } from './dto';

@Controller('users/:userId/calendar')
export class CalendarEventController {
  constructor(private readonly calendarEventService: CalendarEventService) {}

  @Post('holidays')
  async addHolidaysToCalendar(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() addHolidaysDto: AddHolidaysDto,
  ): Promise<CalendarEvent[]> {
    return this.calendarEventService.addHolidaysToCalendar(
      userId,
      addHolidaysDto,
    );
  }
}
