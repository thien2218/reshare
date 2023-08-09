import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath:
            ".env.local" /* Switch to .env.prod when going to production */
      }),
      JwtModule.register({
         secret: "your-secret-key",
         signOptions: { expiresIn: "1h" }
      }),
      UserModule,
      DatabaseModule
   ],
   controllers: [],
   providers: []
})
export class AppModule {}
