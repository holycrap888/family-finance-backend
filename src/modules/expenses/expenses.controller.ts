import { UserId } from "@/common/decorators/user-id.decorator";
import { AddExpenseDto } from "@/common/dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { IExpense } from "@/interfaces";
import { Controller, UseGuards, Post, Body, Get, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { ExpensesService } from "./expenses.service";

// Type for single or array expense request body
type ExpenseBody = Omit<IExpense, '_id' | 'userId' | 'createdAt'> & { userId: string };
type ExpenseRequest = ExpenseBody | ExpenseBody[];

@ApiTags('expenses')
@Controller('expenses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Add expense(s)' })
  @ApiResponse({ status: 201, description: 'Expense(s) added successfully', schema: { type: 'object', example: { message: 'Expense added successfully' } } })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: AddExpenseDto, isArray: true, description: 'Expense data (single object or array)' })
  async add(
    @UserId() userId: string,
    @Body() body: ExpenseRequest
  ) {
    if (Array.isArray(body)) {
      return this.expensesService.addExpenses(userId, body);
    } else {
      return this.expensesService.addExpense(userId, body);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get expenses for a user and month' })
  @ApiQuery({ name: 'month', required: false })
  @ApiResponse({
    status: 200,
    description: 'Expenses retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
          userId: { type: 'string', example: '60d21b4667d0d8992e610c84' },
          amount: { type: 'number', example: 100 },
          category: { type: 'string', example: 'Food' },
          note: { type: 'string', example: 'Lunch at cafe' },
          date: { type: 'string', format: 'date-time', example: '2024-06-01T12:00:00.000Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2024-06-01T12:01:00.000Z' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'No expenses found for the given month' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async get(@UserId() userId: string, @Query('month') month?: string) {
    return this.expensesService.getExpenses(userId, month);
  }
}
