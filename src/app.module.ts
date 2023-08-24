import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { ArticleModule } from "./article/article.module";

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: `.env.${process.env.NODE_ENV}`
      }),
      UserModule,
      DatabaseModule,
      ArticleModule
   ],
   controllers: [],
   providers: []
})
export class AppModule {}
