import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SummaryService } from './summary.service';
import { UserId } from '../../common/decorators/user-id.decorator';

@ApiTags('summary')
@Controller('summary')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get summary for a user and month' })
  @ApiQuery({ name: 'month', required: false })
  async get(@UserId() userId, @Query('month') month: string) {
    return this.summaryService.getSummary(userId, month);
  }
}
