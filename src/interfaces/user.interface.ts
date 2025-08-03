import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  salary: number;
  settings: {
    budgetRatio: {
      needs: number;
      savings: number;
      wants: number;
      investments: number;
      emergency: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
