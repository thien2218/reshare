import { LibsqlError, createClient } from "@libsql/client";
import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";

@Injectable()
export class DatabaseService implements OnModuleInit {
   readonly db: LibSQLDatabase;

   constructor(private readonly configService: ConfigService) {}

   onModuleInit() {
      const url = this.configService.get<string>("DATABASE_URL") as string;
      const authToken = this.configService.get<string>(
         "DATABASE_AUTH_TOKEN"
      ) as string;

      const client = createClient({ url, authToken });
      (this as { db: LibSQLDatabase }).db = drizzle(client);
   }

   handleDbError(err: Error) {
      if (err instanceof LibsqlError) {
         const splitErr = err.message.split(": ");
         const field = splitErr[splitErr.length - 1].split(".")[1];
         const reason = splitErr[splitErr.length - 2];

         const message = {
            reason,
            field
         };

         throw new BadRequestException([message]);
      } else {
         throw new BadRequestException(err.message);
      }
   }
}
