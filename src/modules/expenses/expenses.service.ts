import { getStartDateEndDate } from "@/common/utils";
import { MONGO_COLLECTIONS } from "@/config/mongo.config";
import { MongoService } from "@/core/database";
import { IExpense } from "@/interfaces";
import { Injectable, BadRequestException } from "@nestjs/common";
import { ObjectId } from "mongodb";


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
    const { start, end } = getStartDateEndDate(month);
    
    const collection = this.mongo.getCollection<IExpense>(MONGO_COLLECTIONS.EXPENSES);
    return await collection.find({
      userId: new ObjectId(userId),
      createdAt: { $gte: start, $lt: end }
    }).toArray();
  }
}
