import { getStartDateEndDate, toPercent } from "@/common/utils";
import { MONGO_COLLECTIONS } from "@/config/mongo.config";
import { MongoService } from "@/core/database";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { UsersService } from "../users";


@Injectable()
export class SummaryService {
  constructor(
    private readonly mongo: MongoService,
    private readonly usersService: UsersService
  ) { }

  async getSummary(userId: string, month?: string) {
    const { start, end } = getStartDateEndDate(month);
    const user = await this.usersService.findById(userId);
    if (!user) throw new Error('User not found');

    const expenses = this.mongo.getCollection(MONGO_COLLECTIONS.EXPENSES);

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

  async getChart(userId: string, month?: string) {
    const { start, end } = getStartDateEndDate(month);
    const expenses = this.mongo.getCollection(MONGO_COLLECTIONS.EXPENSES);
    const cahrtData = expenses.aggregate([
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
        $sort: { _id: 1 } // Sort by day of month
      }
    ]).toArray();
    const chart = await cahrtData;
    const chartMap = new Map<number, number>();
    chart.forEach(item => {
      chartMap.set(item._id, item.total);
    }
    );
    const result: { day: number, total: number }[] = [];
    for (let i = 1; i <= 31; i++) {
      result.push({
        day: i,
        total: chartMap.get(i) || 0
      });
    }
    return result;
  }
}
