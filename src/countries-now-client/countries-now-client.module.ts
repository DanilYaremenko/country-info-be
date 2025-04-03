import { Module } from '@nestjs/common';
import { CountriesNowClientService } from './countries-now-client.service';

@Module({
  providers: [CountriesNowClientService],
  exports: [CountriesNowClientService],
})
export class CountriesNowClientModule {}
