import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class AddHolidaysDto {
  @IsString()
  countryCode: string;

  @IsNumber()
  year: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  holidays?: string[];
}
