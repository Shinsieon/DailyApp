import { Injectable, Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { UsersModule } from 'src/users/users.module';
import { TransactionsService } from './transactions.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Transaction]),
    UsersModule,
    AuthModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
