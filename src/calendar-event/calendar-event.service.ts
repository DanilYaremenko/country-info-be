import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { User } from '../user/entities/user.entity';
import { NagerClientService } from '../nager-client/nager-client.service';
import { AddHolidaysDto } from './dto';

@Injectable()
export class CalendarEventService {
  private readonly logger = new Logger(CalendarEventService.name);

  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarEventRepository: Repository<CalendarEvent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly nagerClientService: NagerClientService,
  ) {}

  async addHolidaysToCalendar(
    userId: number,
    addHolidaysDto: AddHolidaysDto,
  ): Promise<CalendarEvent[]> {
    this.logger.debug(
      `Adding holidays for country ${addHolidaysDto.countryCode} in year ${addHolidaysDto.year} to user ${userId}'s calendar`,
    );

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const allHolidays = await this.nagerClientService.getPublicHolidays(
      addHolidaysDto.countryCode,
      addHolidaysDto.year,
    );

    if (!allHolidays.length) {
      this.logger.error(
        `No holidays found for country ${addHolidaysDto.countryCode} in year ${addHolidaysDto.year}`,
      );
      throw new BadRequestException(
        `No holidays found for country ${addHolidaysDto.countryCode} in year ${addHolidaysDto.year}`,
      );
    }

    let selectedHolidays = allHolidays;

    if (addHolidaysDto.holidays && addHolidaysDto.holidays.length > 0) {
      selectedHolidays = allHolidays.filter((holiday) =>
        addHolidaysDto.holidays.includes(holiday.name),
      );
    } else {
      this.logger.warn(
        `No specific holidays provided, adding all holidays for country ${addHolidaysDto.countryCode} in year ${addHolidaysDto.year}`,
      );
    }

    if (!selectedHolidays.length) {
      this.logger.error(
        `No matching holidays found for the provided names in country ${addHolidaysDto.countryCode} in year ${addHolidaysDto.year}`,
      );
      throw new BadRequestException(
        `No matching holidays found for the provided names in country ${addHolidaysDto.countryCode} in year ${addHolidaysDto.year}`,
      );
    }

    const startDate = new Date(addHolidaysDto.year, 0, 1); // January 1st
    const endDate = new Date(addHolidaysDto.year, 11, 31); // December 31st

    const existingEvents = await this.calendarEventRepository.find({
      where: {
        userId,
        countryCode: addHolidaysDto.countryCode,
        date: Between(startDate, endDate),
      },
    });

    // Create a set of existing event keys (name + date)
    const existingEventKeys = new Set(
      existingEvents.map(
        (event) => `${event.name}_${event.date.toISOString().split('T')[0]}`,
      ),
    );

    // Filter out holidays that already exist in the user's calendar
    const newHolidays = selectedHolidays.filter((holiday) => {
      const holidayKey = `${holiday.name}_${holiday.date}`;
      return !existingEventKeys.has(holidayKey);
    });

    if (!newHolidays.length) {
      this.logger.warn(
        `All selected holidays already exist in user ${userId}'s calendar`,
      );
      return [];
    }

    const calendarEvents = newHolidays.map((holiday) => {
      const event = new CalendarEvent();
      event.name = holiday.name;
      event.date = new Date(holiday.date);
      event.countryCode = addHolidaysDto.countryCode;
      event.description = holiday.localName;
      event.userId = userId;

      return event;
    });

    const savedEvents = await this.calendarEventRepository.save(calendarEvents);

    this.logger.debug(
      `Added ${savedEvents.length} new holidays to user ${userId}'s calendar`,
    );

    return savedEvents;
  }
}
