import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath:
            ".env.local" /* Switch to .env.prod when going to production */
      }),
      UserModule,
      DatabaseModule
   ],
   controllers: [],
   providers: []
})
export class AppModule {}
