import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { MemoService } from "./memo.service";
import { Memo } from "./memo.entity";

@Controller("memos")
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Post(":userId")
  async createMemo(
    @Param("userId") userId: number,
    @Body() memoData: Partial<Memo>
  ) {
    return this.memoService.createMemo(userId, memoData);
  }

  @Get(":userId")
  async getMemosByUser(@Param("userId") userId: number) {
    return this.memoService.getMemosByUser(userId);
  }

  @Get(":id")
  async getMemoById(@Param("id") id: number) {
    return this.memoService.getMemoById(id);
  }

  @Post("multiple/:userId")
  async createMultipleMemos(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() data: any
  ): Promise<Memo[]> {
    console.log("controller", data);
    data.memos.forEach((memo: any) => {
      memo.group_name = memo.group;
      delete memo.group;
    });
    return this.memoService.createMultipleMemos(userId, data.memos);
  }

  @Put(":id")
  async updateMemo(@Param("id") id: number, @Body() updateData: Partial<Memo>) {
    return this.memoService.updateMemo(id, updateData);
  }

  @Delete(":id")
  async deleteMemo(@Param("id") id: number) {
    return this.memoService.deleteMemo(id);
  }
}
