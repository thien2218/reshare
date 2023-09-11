import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { AccessStrategy } from "src/user/auth/strategies/access.strategy";
import { DatabaseModule } from "src/database/database.module";

@Module({
   imports: [DatabaseModule],
   controllers: [TagController],
   providers: [TagService, AccessStrategy]
})
export class TagModule {}
