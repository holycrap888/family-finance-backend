import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [UsersModule],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
