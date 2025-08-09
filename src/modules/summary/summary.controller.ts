import { UserId } from "@/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { Controller, UseGuards, Get, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { SummaryService } from "./summary.service";


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

  @Get('chart')
  @ApiOperation({ summary: 'Get chart data for a user and month' })
  @ApiQuery({ name: 'month', required: false })
  async getChart(@UserId() userId, @Query('month') month: string) {
    return this.summaryService.getChart(userId, month);
  }
}
