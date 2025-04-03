import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PopulationCountDto } from './dto';

@Injectable()
export class CountriesNowClientService {
  private readonly logger = new Logger(CountriesNowClientService.name);
  private countriesNowBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.countriesNowBaseUrl = this.configService.get<string>(
      'COUNTRIES_NOW_BASE_URL',
    );
  }

  async getCountryPopulation(country: string): Promise<PopulationCountDto[]> {
    this.logger.debug(`Fetching population data for country: ${country}`);

    if (!country || country.trim() === '') {
      this.logger.error('Country name is required');
      throw new BadRequestException('Country name is required');
    }

    try {
      const url = `${this.countriesNowBaseUrl}/countries/population`;
      const response = await axios.post(
        url,
        { country },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (
        !response.data?.data?.populationCounts ||
        !Array.isArray(response.data?.data.populationCounts)
      ) {
        this.logger.warn(`No population data found for country: ${country}`);
        return [];
      }

      return response.data.data.populationCounts;
    } catch (error) {
      this.logger.error(
        `Failed to fetch population data for ${country}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to fetch population data for ${country}`,
      );
    }
  }

  async getCountryFlagUrl(country: string): Promise<string> {
    this.logger.debug(`Fetching flag image URL for country: ${country}`);

    if (!country || country.trim() === '') {
      this.logger.error('Country name is required');
      throw new BadRequestException('Country name is required');
    }

    try {
      const url = `${this.countriesNowBaseUrl}/countries/flag/images`;
      const response = await axios.post(
        url,
        { country },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data?.data || !response.data?.data.flag) {
        this.logger.warn(`No flag image found for country: ${country}`);
        return null;
      }

      return response.data.data.flag;
    } catch (error) {
      this.logger.error(
        `Failed to fetch flag image URL for ${country}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to fetch flag image URL for ${country}`,
      );
    }
  }
}
