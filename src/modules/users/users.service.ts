import { Injectable } from '@nestjs/common';
import { MongoService } from 'src/core/database/mongo.service';
import { IUser } from 'src/interfaces/user.interface';
import { ObjectId } from 'mongodb';
import { MONGO_COLLECTIONS } from 'src/config/mongo.config';

@Injectable()
export class UsersService {
  constructor(private readonly mongo: MongoService) {}

  private get collection() {
    return this.mongo.getCollection<IUser>(MONGO_COLLECTIONS.USERS);
  }

  async createUser(user: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    await this.collection.insertOne({
      ...user,
      createdAt: now,
      updatedAt: now,
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.collection.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async updateSettings(userId: string, settings: IUser['settings']) {
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { settings, updatedAt: new Date() } },
    );
  }
}
