import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { DatabaseModule } from "src/database/database.module";
import { AccessStrategy } from "src/user/auth/strategies/access.strategy";

@Module({
   imports: [DatabaseModule],
   controllers: [ArticleController],
   providers: [ArticleService, AccessStrategy]
})
export class ArticleModule {}
