import { Injectable } from '@nestjs/common';
import { MongoService } from 'src/core/database/mongo.service';
import { ObjectId } from 'mongodb';
import { MONGO_COLLECTIONS } from 'src/config/mongo.config';
import { toPercent } from '../../common/utils';
import { UsersService } from '../users';

@Injectable()
export class SummaryService {
  constructor(
    private readonly mongo: MongoService,
    private readonly usersService: UsersService
  ) { }

  async getSummary(userId: string, month?: string) {
    let start: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const user = await this.usersService.findById(userId);
    if (!user) throw new Error('User not found');

    const expenses = this.mongo.getCollection(MONGO_COLLECTIONS.EXPENSES);
    if (month)
      start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const cursor = await expenses.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]).toArray();

    const totalSpent = cursor.reduce((acc, cur) => acc + cur.total, 0);

    // Create a map for quick category lookup
    const categoryTotals = cursor.reduce<Record<string, number>>((acc, cur) => {
      acc[cur._id] = cur.total;
      return acc;
    }, {});

    const getBudgetAmount = (type: keyof typeof user.settings.budgetRatio) =>
      user.salary * (user.settings.budgetRatio[type] / 100);

    const sumCategories = (categories: string[]) =>
      categories.reduce((sum, cat) => sum + (categoryTotals[cat] || 0), 0);

    return {
      month,
      salary: user.salary,
      totalBalance: user.salary - totalSpent,
      budgetRatio: Object.fromEntries(
        Object.entries(user.settings.budgetRatio).map(([k, v]) => [k, toPercent(v)])
      ),
      recommended: Object.fromEntries(
        Object.entries(user.settings.budgetRatio).map(([k, v]) => [k, user.salary * (v / 100)])
      ),
      actual: {
        totalSpent,
        byCategory: categoryTotals,
        needsBalance: getBudgetAmount('needs') - sumCategories(['transport', 'bills', 'food']),
        wantsBalance: getBudgetAmount('wants') - sumCategories(['entertainment', 'shopping']),
      }
    };
  }
}
