import { IsString } from 'class-validator';

export class BorderCountryDto {
  @IsString()
  commonName: string;

  @IsString()
  officialName: string;

  @IsString()
  countryCode: string;

  @IsString()
  region: string;

  @IsString()
  borders: string;
}
