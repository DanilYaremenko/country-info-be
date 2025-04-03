import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { NagerClientModule } from '../nager-client/nager-client.module';
import { CountriesNowClientModule } from '../countries-now-client/countries-now-client.module';

@Module({
  imports: [NagerClientModule, CountriesNowClientModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
