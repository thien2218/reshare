import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "../database.module";
import { DB_CONNECTION } from "src/constants";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import { ConfigService } from "@nestjs/config";
import { MockConfigService } from "../__mocks__/config.service";

describe("DatabaseModule", () => {
   let dbConnection: LibSQLDatabase;

   beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule]
      })
         .overrideProvider(ConfigService)
         .useValue(MockConfigService)
         .compile();

      dbConnection = moduleRef.get(DB_CONNECTION);
   });

   it("should be defined", () => {
      expect(dbConnection).toBeDefined();
   });

   it("should connect to the database", async () => {
      const result = await dbConnection.run(sql`SELECT 1+1 as result`);
      expect(result.rows[0].result).toBe(2);
   });
});
