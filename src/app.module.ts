import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CountryModule } from './country/country.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEventModule } from './calendar-event/calendar-event.module';
import { CountriesNowClientModule } from './countries-now-client/countries-now-client.module';
import { NagerClientModule } from './nager-client/nager-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: +configService.get<string>('POSTGRES_PORT') || 5432,
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // dev only
      }),
    }),
    UserModule,
    CountryModule,
    CalendarEventModule,
    CountriesNowClientModule,
    NagerClientModule,
  ],
})
export class AppModule {}
