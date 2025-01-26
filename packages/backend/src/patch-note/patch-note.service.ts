import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PatchNote } from "./patch-note.entity";

@Injectable()
export class PatchNoteService {
  constructor(
    @InjectRepository(PatchNote)
    private readonly patchNoteRepository: Repository<PatchNote>
  ) {}

  async getAll(): Promise<PatchNote[]> {
    return await this.patchNoteRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async create(patchNoteData: Partial<PatchNote>): Promise<PatchNote> {
    const newPatchNote = this.patchNoteRepository.create(patchNoteData);
    return await this.patchNoteRepository.save(newPatchNote);
  }
}
