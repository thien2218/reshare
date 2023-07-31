import { Module } from "@nestjs/common";
import { DB_CONNECTION } from "src/constants";
import { ConfigService } from "@nestjs/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

@Module({
   providers: [
      {
         provide: DB_CONNECTION,
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) => {
            const url = configService.get<string>("DATABASE_URL") as string;
            const authToken = configService.get<string>(
               "DATABASE_AUTH_TOKEN"
            ) as string;

            const client = createClient({ url, authToken });
            return drizzle(client);
         }
      }
   ],
   exports: [DB_CONNECTION]
})
export class DatabaseModule {}
