import { BadRequestException, Injectable } from '@nestjs/common';
import { MongoService } from 'src/core/database/mongo.service';
import { IExpense } from 'src/interfaces/expense.interface';
import { ObjectId } from 'mongodb';
import { MONGO_COLLECTIONS } from 'src/config/mongo.config';

@Injectable()
export class ExpensesService {
  private readonly validCategories = new Set([
      'emergency',
      'food',
      'shopping',
      'transport',
      'bills',
      'entertainment',
      'investments',
      'others'
    ]);
  constructor(private readonly mongo: MongoService) { }

  async addExpense(userId: string, dto: Omit<IExpense, '_id' | 'userId' | 'createdAt'>) {
    if (!this.validCategories.has(dto?.category)) {
      throw new BadRequestException(`Invalid expense category: ${dto.category}`);
    }
    const collection = this.mongo.getCollection<IExpense>(MONGO_COLLECTIONS.EXPENSES);
    await collection.insertOne({
      ...dto,
      userId: new ObjectId(userId),
      date: new Date(dto.date),
      createdAt: new Date()
    });
    return { message: 'Expense added successfully' };
  }

  async addExpenses(userId: string, dtos: Array<Omit<IExpense, '_id' | 'userId' | 'createdAt'>>) {
    for (const dto of dtos) {
      if (!this.validCategories.has(dto?.category)) {
      throw new BadRequestException(`Invalid expense category: ${dto.category}`);
      }
    }
    const collection = this.mongo.getCollection<IExpense>(MONGO_COLLECTIONS.EXPENSES);
    const docs = dtos.map(dto => ({
      ...dto,
      userId: new ObjectId(userId),
      date: new Date(dto.date),
      createdAt: new Date()
    }));
    await collection.insertMany(docs);
    return { message: `${docs.length} expenses added successfully` };
  }

  async getExpenses(userId: string, month?: string) {
    let start: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const collection = this.mongo.getCollection<IExpense>(MONGO_COLLECTIONS.EXPENSES);
    if (month)
      start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    return await collection.find({
      userId: new ObjectId(userId),
      createdAt: { $gte: start, $lt: end }
    }).toArray();
  }
}
