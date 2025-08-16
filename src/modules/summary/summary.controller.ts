import { UserId } from "@/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { Controller, UseGuards, Get, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { SummaryService } from "./summary.service";


@ApiTags('summary')
@Controller('summary')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get summary for a user and month' })
  @ApiResponse({
    status: 200,
    description: 'Summary retrieved successfully',
    schema: {
      type: 'object',
      example: {
        month: '2024-06',
        salary: 5000,
        totalBalance: 2000,
        budgetRatio: { food: '30%', rent: '40%' },
        recommended: { food: 1500, rent: 2000 },
        actual: { totalSpent: 3200, byCategory: { food: 1200, rent: 1800 } }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'No summary found for the given month' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'month', required: false, description: 'Month in YYYY-MM format' })
  async get(@UserId() userId, @Query('month') month: string) {
    return this.summaryService.getSummary(userId, month);
  }

  @Get('chart')
  @ApiOperation({ summary: 'Get daily chart data for a user and month' })
  @ApiResponse({
    status: 200,
    description: 'Daily chart data retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'string', format: 'number', example: '1' },
          total: { type: 'string', example: '100' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'No chart data found for the given month' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'month', required: false, description: 'Month in YYYY-MM format' })
  async getChart(@UserId() userId, @Query('month') month: string) {
    return this.summaryService.getChart(userId, month);
  }
}
