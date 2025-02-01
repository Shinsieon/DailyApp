import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Memo } from "./memo.entity";
import { User } from "src/auth/auth.entity";

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(Memo)
    private readonly memoRepository: Repository<Memo>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // 🔹 Memo 생성 (User 연결)
  async createMemo(userId: number, memoData: Partial<Memo>): Promise<Memo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const memo = this.memoRepository.create({ ...memoData, user });
    return this.memoRepository.save(memo);
  }

  // 🔹 특정 유저의 모든 Memo 가져오기
  async getMemosByUser(userId: number): Promise<Memo[]> {
    return this.memoRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" }, // 최신순 정렬
    });
  }

  async createMultipleMemos(
    userId: number,
    memos: Partial<Memo>[] = []
  ): Promise<Memo[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    console.log(memos);

    await this.memoRepository.delete({ user: { id: userId } });
    const newMemos = memos.map((memo) =>
      this.memoRepository.create({
        ...memo,
        user,
      })
    );

    return this.memoRepository.save(newMemos);
  }

  // 🔹 특정 Memo 가져오기
  async getMemoById(id: number): Promise<Memo | null> {
    return this.memoRepository.findOne({ where: { id }, relations: ["user"] });
  }

  // 🔹 Memo 수정
  async updateMemo(id: number, updateData: Partial<Memo>): Promise<Memo> {
    await this.memoRepository.update(id, updateData);
    return this.memoRepository.findOne({ where: { id } });
  }

  // 🔹 Memo 삭제
  async deleteMemo(id: number): Promise<void> {
    await this.memoRepository.delete(id);
  }
}
