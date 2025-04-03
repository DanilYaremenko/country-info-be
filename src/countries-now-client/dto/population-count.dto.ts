import { IsNumber } from 'class-validator';

export class PopulationCountDto {
  @IsNumber()
  year: number;

  @IsNumber()
  value: number;
}
