import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, Collection, Document } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client!: MongoClient;
  private db!: Db;
  private readonly logger = new Logger(MongoService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const mongoUri = this.configService.get<string>('MONGO_URI');
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    this.client = new MongoClient(mongoUri);
    await this.client.connect();

    const dbName = this.configService.get<string>('DB_NAME');
    if (!dbName) {
      throw new Error('DB_NAME environment variable is not defined');
    }
    this.db = this.client.db(dbName);
    this.logger.log('📡 MongoDB connected');
  }

  getCollection<T extends Document = Document>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }

  async onModuleDestroy() {
    await this.client?.close();
    this.logger.log('🛑 MongoDB disconnected');
  }
}