import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { NagerClientService } from '../nager-client/nager-client.service';
import { CountriesNowClientService } from '../countries-now-client/countries-now-client.service';
import { CountryInfoDto } from './dto';

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);

  constructor(
    private readonly nagerClientService: NagerClientService,
    private readonly countriesNowClientService: CountriesNowClientService,
  ) {}

  async findAll() {
    return await this.nagerClientService.getAllCountries();
  }

  async findOne(countryCode: string): Promise<CountryInfoDto> {
    this.logger.debug(`Getting info for country code: ${countryCode}`);

    if (!countryCode || countryCode.trim() === '') {
      this.logger.error('Country code is required');
      throw new NotFoundException('Country code is required');
    }

    const country = await this.nagerClientService.getOneCountry(countryCode);

    if (!country) {
      this.logger.error(`Country with code ${countryCode} not found`);
      throw new NotFoundException(`Country with code ${countryCode} not found`);
    }

    const [borderCountries, population, flagUrl] = await Promise.all([
      this.nagerClientService.getBorderCountries(countryCode),
      this.countriesNowClientService.getCountryPopulation(country.commonName),
      this.countriesNowClientService.getCountryFlagUrl(country.commonName),
    ]);

    return {
      code: country.countryCode,
      name: country.commonName,
      region: country.region,
      borderCountries: borderCountries || [],
      population: population || [],
      flagUrl: flagUrl || '',
    };
  }
}
