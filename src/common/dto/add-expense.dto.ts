import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from 'src/interfaces/expense.interface';

export class AddExpenseDto {
  @ApiProperty({ description: 'Expense amount', example: 100 })
  amount!: number;

  @ApiProperty({ description: 'Expense category', enum: ["investments", "emergency", "transport", "bills", "food", "entertainment", "shopping", "others"], example: 'food' })
  category!: ExpenseCategory;

  @ApiProperty({ description: 'Expense note', example: 'Lunch at restaurant' })
  note!: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Date of expense', example: '2025-08-03T12:00:00.000Z' })
  date!: Date;
}
