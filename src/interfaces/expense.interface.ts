import { ObjectId } from 'mongodb';

export type ExpenseCategory = 'emergency' | 'food' | 'shopping' | 'transport' | 'bills' | 'entertainment' | 'investments' | 'others';

export interface IExpense {
  _id?: ObjectId;
  userId: ObjectId;
  amount: number;
  category: ExpenseCategory;
  note: string;
  date: Date;
  createdAt: Date;
}
