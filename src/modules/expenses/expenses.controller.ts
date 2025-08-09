import { UserId } from "@/common/decorators/user-id.decorator";
import { AddExpenseDto } from "@/common/dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { IExpense } from "@/interfaces";
import { Controller, UseGuards, Post, Body, Get, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiQuery } from "@nestjs/swagger";
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
  async get(@UserId() userId: string, @Query('month') month?: string) {
    return this.expensesService.getExpenses(userId, month);
  }
}
