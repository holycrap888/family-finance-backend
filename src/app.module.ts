// filepath: /home/holycrap/git/family-finance-backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { SummaryModule } from './modules/summary/summary.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { UsersModule } from './modules/users/users.module';
import { MongoModule } from './core/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ExpensesModule,
    UsersModule,
    AuthModule,
    SummaryModule,
    MongoModule,
  ],
})
export class AppModule {}