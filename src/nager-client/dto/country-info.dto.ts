import { IsArray, IsString } from 'class-validator';
import { BorderCountryDto } from './border-country.dto';

export class NagerCountryInfoDto {
  @IsString()
  commonName: string;

  @IsString()
  officialName: string;

  @IsString()
  countryCode: string;

  @IsString()
  region: string;

  @IsArray()
  @IsString({ each: true })
  borders: BorderCountryDto[];
}
