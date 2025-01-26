import { Controller, Get, Post, Body } from "@nestjs/common";
import { PatchNote } from "./patch-note.entity";
import { PatchNoteService } from "./patch-note.service";

@Controller("patch-notes")
export class PatchNoteController {
  constructor(private readonly patchNoteService: PatchNoteService) {}

  @Get()
  async getAll(): Promise<PatchNote[]> {
    return await this.patchNoteService.getAll();
  }

  @Post()
  async create(@Body() patchNoteData: Partial<PatchNote>): Promise<PatchNote> {
    return await this.patchNoteService.create(patchNoteData);
  }
}
