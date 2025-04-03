import { BorderCountryDto } from '../../nager-client/dto';
import { PopulationCountDto } from '../../countries-now-client/dto';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CountryInfoDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  region: string;

  @Type(() => BorderCountryDto)
  borderCountries: BorderCountryDto[];

  @Type(() => PopulationCountDto)
  population: PopulationCountDto[];

  @IsString()
  flagUrl: string;
}
