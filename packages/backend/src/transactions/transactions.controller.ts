import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}
    
  @UseGuards(AuthGuard)
  @Get('categories/:type')
  async getCategories(@Param('type') type: string) {
    return await this.transactionsService.getCategories(type);
  }

  @UseGuards(AuthGuard)
  @Post('category')
  async createCategory(@Body() body: { name: string, type: string }) {
    return await this.transactionsService.createCategory(body.name, body.type);
  }

  @UseGuards(AuthGuard)
  @Get('category/:id')
  async getCategory(id: number) {
    return await this.transactionsService.getCategory(id);
  }

  @UseGuards(AuthGuard)
  @Delete('category/:id')
  async deleteCategory(id: number) {
    return await this.transactionsService.deleteCategory(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto
  ) {
    return await this.transactionsService.createTransaction(createTransactionDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTransaction(@Param('id') id: number) {
    return await this.transactionsService.deleteTransaction(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getTransactionsByUser(
    @Query('userId') userId: number, 
    @Query('startDate') startDate?: string, 
    @Query('endDate') endDate?: string) {
      let start= null;
      let end = null;
      if(startDate){
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // 시작 날짜의 0시로 설정
      }
      if(endDate){
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // 끝 날
      }
    return await this.transactionsService.getTransactionsByUser(userId,start,end);
  }

  @UseGuards(AuthGuard)
  @Get('summary')
  async getTransactionSummary(@Query('userId') userId: string,@Query('startDate') startDate: string,
@Query('endDate') endDate: string
) {
      let start= null;
      let end = null;
      if(startDate){
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // 시작 날짜의 0시로 설정
      }
      if(endDate){
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // 끝 날
      }
    const response = await this.transactionsService.getTransactionSummary(userId, start, end);
    return response;
  }

  @UseGuards(AuthGuard)
  @Get('transactionSummaryByCategory')
  async getTransactionSummaryByCategory(@Query('userId') userId: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    let start= null;
    let end = null;
    if(startDate){
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // 시작 날짜의 0시로 설정
    }
    if(endDate){
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // 끝 날
    }
    return await this.transactionsService.getTransactionSummaryByCategory(userId, start, end);
  }
}
