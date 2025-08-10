import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { MONGO_COLLECTIONS } from "@/config/mongo.config";
import { MongoService } from "@/core/database";
import { IUser } from "@/interfaces";


@Injectable()
export class UsersService {
  constructor(private readonly mongo: MongoService) {}

  private get collection() {
    return this.mongo.getCollection<IUser>(MONGO_COLLECTIONS.USERS);
  }

  async createUser(user: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<void> {
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

  async updateSettings(userId: string, settings: IUser['settings']): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { settings, updatedAt: new Date() } },
    );
  }
}
