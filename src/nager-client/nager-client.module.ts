import { Module } from '@nestjs/common';
import { NagerClientService } from './nager-client.service';

@Module({
  providers: [NagerClientService],
  exports: [NagerClientService],
})
export class NagerClientModule {}
