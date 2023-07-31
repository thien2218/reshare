import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";

@Module({
   imports: [
      UserModule,
      DatabaseModule,
      ConfigModule.forRoot({ isGlobal: true })
   ],
   controllers: [],
   providers: []
})
export class AppModule {}
