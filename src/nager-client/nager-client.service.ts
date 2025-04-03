import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BorderCountryDto, NagerCountryDto, NagerCountryInfoDto } from './dto';
import axios from 'axios';

@Injectable()
export class NagerClientService {
  private readonly logger = new Logger(NagerClientService.name);
  private nagerBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.nagerBaseUrl = this.configService.get<string>('DATE_NAGER_BASE_URL');
  }

  async getAllCountries(): Promise<NagerCountryDto[]> {
    try {
      const url = `${this.nagerBaseUrl}/AvailableCountries`;
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch countries from Date Nager API: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to fetch countries from Date Nager API',
      );
    }
  }

  async getOneCountry(countryCode: string): Promise<NagerCountryInfoDto> {
    try {
      if (!countryCode || countryCode.trim() === '') {
        this.logger.error(`Country code is required, recieved: ${countryCode}`);
        throw new BadRequestException('Country code is required');
      }

      const url = `${this.nagerBaseUrl}/CountryInfo/${countryCode}`;
      this.logger.debug(`Fetching country info from: ${url}`);

      const response = await axios.get(url);

      if (!response.data) {
        this.logger.error(
          `Country with code ${countryCode} not found in Date Nager API`,
        );
        throw new NotFoundException(
          `Country with code ${countryCode} not found`,
        );
      }

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.logger.error(`Country with code ${countryCode} not found`);
        throw new NotFoundException(
          `Country with code ${countryCode} not found`,
        );
      }

      this.logger.error(
        `Failed to fetch country info for ${countryCode}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to fetch country info for ${countryCode}`,
      );
    }
  }
  async getBorderCountries(countryCode: string): Promise<BorderCountryDto[]> {
    if (!countryCode || countryCode.trim() === '') {
      this.logger.error(`Country code is required, recieved: ${countryCode}`);
      throw new BadRequestException('Country code is required');
    }

    try {
      const url = `${this.nagerBaseUrl}/CountryInfo/${countryCode}`;
      const response = await axios.get(url);

      if (!response.data?.borders || !Array.isArray(response.data?.borders)) {
        return [];
      }

      return response.data.borders;
    } catch (error) {
      this.logger.error(
        `Failed to fetch border countries for ${countryCode}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to fetch border countries for ${countryCode}`,
      );
    }
  }

  async getPublicHolidays(countryCode: string, year: number) {
    if (!countryCode || countryCode.trim() === '') {
      this.logger.error(`Country code is required, recieved: ${countryCode}`);
      throw new BadRequestException('Country code is required');
    }

    if (!year || year < 1900 || year > 2100) {
      this.logger.error(`Valid year is required, recieved: ${year}`);
      throw new BadRequestException(
        'Valid year is required (between 1900-2100)',
      );
    }

    try {
      const url = `${this.nagerBaseUrl}/PublicHolidays/${year}/${countryCode}`;
      this.logger.debug(`Fetching public holidays from: ${url}`);

      const response = await axios.get(url);

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.logger.warn(
          `No holidays found for country ${countryCode} and year ${year}`,
        );
        return [];
      }

      this.logger.error(
        `Failed to fetch holidays for ${countryCode} in ${year}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to fetch holidays for ${countryCode} in ${year}`,
      );
    }
  }
}
