import { getStartDateEndDate, toPercent } from "@/common/utils";
import { MONGO_COLLECTIONS } from "@/config/mongo.config";
import { MongoService } from "@/core/database";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { UsersService } from "../users";
import { ISummary, ISummaryChart } from "@/interfaces";


@Injectable()
export class SummaryService {
  constructor(
    private readonly mongo: MongoService,
    private readonly usersService: UsersService
  ) { }

  async getSummary(userId: string, month?: string): Promise<ISummary> {
    const { start, end } = getStartDateEndDate(month);

    const user = await this.usersService.findById(userId);
    if (!user) throw new Error('User not found');

    const expenses = this.mongo.getCollection(MONGO_COLLECTIONS.EXPENSES);

    const expenseData = await expenses.aggregate([
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

    const categoryTotals = Object.fromEntries(
      expenseData.map(({ _id, total }) => [_id, total])
    );
    const totalSpent = expenseData.reduce((sum, { total }) => sum + total, 0);

    const { budgetRatio } = user.settings;
    const getBudgetAmount = (type: keyof typeof budgetRatio) =>
      user.salary * (budgetRatio[type] / 100);

    const sumCategories = (categories: string[]) =>
      categories.reduce((sum, cat) => sum + (categoryTotals[cat] || 0), 0);

    const balances = [
      {
        key: 'needsBalance',
        categories: ['bills', 'transport', 'food'],
        type: 'needs'
      },
      {
        key: 'wantsBalance',
        categories: ['entertainment', 'shopping', 'others'],
        type: 'wants'
      },
      {
        key: 'savingsBalance',
        categories: ['savings'],
        type: 'savings'
      },
      {
        key: 'investmentsBalance',
        categories: ['investments'],
        type: 'investments'
      },
      {
        key: 'emergencyBalance',
        categories: ['emergency'],
        type: 'emergency'
      }
    ];

    const actualBalances = balances.reduce((acc, { key, categories, type }) => {
      const actual = sumCategories(categories);
      acc[key] = {
        recommended: getBudgetAmount(type as keyof typeof budgetRatio),
        actual,
        difference: getBudgetAmount(type as keyof typeof budgetRatio) - actual
      };
      return acc;
    }, {} as Record<string, { recommended: number, actual: number, difference: number }>);

    return {
      month,
      salary: user.salary,
      totalBalance: user.salary - totalSpent,
      budgetRatio: Object.fromEntries(
        Object.entries(budgetRatio).map(([k, v]) => [k, toPercent(v)])
      ),
      recommended: Object.fromEntries(
        Object.entries(budgetRatio).map(([k, v]) => [k, user.salary * (v / 100)])
      ),
      actual: {
        totalSpent,
        byCategory: categoryTotals,
        ...actualBalances,
      }
    };
  }

  async getChart(userId: string, month?: string): Promise<ISummaryChart[]> {
    const { start, end } = getStartDateEndDate(month);
    const expenses = this.mongo.getCollection(MONGO_COLLECTIONS.EXPENSES);
    const chartData = await expenses.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          date: { $gte: start, $lt: end }
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]).toArray();

    const chartMap = new Map<number, number>();
    chartData.forEach(item => {
      chartMap.set(item._id, item.total);
    });

    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const result: { day: number, total: number }[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({
        day: i,
        total: chartMap.get(i) || 0
      });
    }
    return result;
  }
}
