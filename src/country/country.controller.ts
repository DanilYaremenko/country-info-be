import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryInfoDto } from './dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll() {
    return this.countryService.findAll();
  }

  @Get(':code')
  async findOne(@Param('code') code: string): Promise<CountryInfoDto> {
    return this.countryService.findOne(code.toUpperCase());
  }
}
