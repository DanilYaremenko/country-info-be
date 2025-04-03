import { IsString } from 'class-validator';

export class NagerCountryDto {
  @IsString()
  countryCode: string;

  @IsString()
  name: string;
}
