import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PatchNote } from "./patch-note.entity";
import { PatchNoteService } from "./patch-note.service";
import { PatchNoteController } from "./patch-note.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PatchNote])],
  controllers: [PatchNoteController],
  providers: [PatchNoteService],
})
export class PatchNoteModule {}
