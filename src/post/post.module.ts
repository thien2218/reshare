import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { DatabaseModule } from "src/database/database.module";
import { AccessStrategy } from "src/user/auth/strategies/access.strategy";

@Module({
   providers: [PostService, AccessStrategy],
   controllers: [PostController],
   imports: [DatabaseModule]
})
export class PostModule {}
