import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/users/users.entity';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async createCategory(name: string, type:string) {
    const category = new Category();
    category.name = name;
    category.type = type;
    return await this.categoryRepository.save(category);
  }
  async getCategory(id: number) {
    return await this.categoryRepository.findOneBy({id});
  }
  async updateCategory(id: number, name: string) {
    const category = await this.getCategory(id);
    category.name = name;
    return await this.categoryRepository.save(category);
  }
  async deleteCategory(id: number) {
    const category = await this.getCategory(id);
    return await this.categoryRepository.remove(category);
  }
  async getCategories(type : string ) {
    return await this.categoryRepository.find({where: {type}});
  }

  async getIncomes() {
    return await this.categoryRepository.find();
  }

  async createTransaction(createTransactionDto : CreateTransactionDto) {
    const { date, type, amount, categoryId, userId, description } = createTransactionDto;
    const transaction = new Transaction();
    transaction.date = date;
    transaction.type = type;
    transaction.amount = amount;
    transaction.category = await this.getCategory(categoryId);
    transaction.categoryName = transaction.category.name;
    transaction.description = description || '';
    transaction.user = { id: userId } as User; // Assuming User entity has only id field for simplicity
    return await this.transactionRepository.save(transaction);
  }

  async deleteTransaction(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    return await this.transactionRepository.remove(transaction);
  }

  async getTransactionsByUser(userId: number, startDate?: Date, endDate?: Date) {
    const whereConditions: any = {
      user: { id: userId },
    };

    if (startDate) {
      whereConditions.date = MoreThanOrEqual(startDate);
    }

    if (endDate) {
      whereConditions.date = LessThanOrEqual(endDate);
    }

    if (startDate && endDate) {
      whereConditions.date = Between(startDate, endDate);
    }

    const transactions = await this.transactionRepository.find({
      where: whereConditions,
      relations: ['category', 'user'],
      order: { date: 'DESC' },
    });

    return transactions.map(transaction => ({
      ...transaction,
      categoryName: transaction.category.name,
    }));

  }
  async getTransactionSummary(userId: string, startDate?: Date, endDate?: Date) {
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'amount')
      .where('transaction.userId = :userId', { userId });

    if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
    }

    const incomeQuery = queryBuilder.clone()
      .andWhere('transaction.type = :type', { type: 'income' })
      .getRawOne();

    const expenseQuery = queryBuilder.clone()
      .andWhere('transaction.type = :type', { type: 'expense' })
      .getRawOne();

    const [income, expense] = await Promise.all([incomeQuery, expenseQuery]);

    return {
      income: income.amount || 0,
      expense: expense.amount || 0,
    };
  }

  async getTransactionSummaryByCategory(userId: string, startDate?: Date, endDate?: Date) {
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
      .select('transaction.categoryName', 'name')
      .addSelect('transaction.type', 'type')
      .addSelect('SUM(transaction.amount)', 'amount')
      .where('transaction.userId = :userId', { userId })
      .groupBy('transaction.categoryName')
      .addGroupBy('transaction.type');
    
    if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
    }

    return await queryBuilder.getRawMany();
    
    
  }
  
}
