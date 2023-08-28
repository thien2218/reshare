import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { MockConfigService } from "../__mocks__/config.service";
import { DatabaseService } from "../database.service";
import { sql } from "drizzle-orm";

describe("DatabaseService", () => {
   let dbService: DatabaseService;

   beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
         providers: [
            DatabaseService,
            {
               provide: ConfigService,
               useValue: MockConfigService
            }
         ]
      }).compile();

      dbService = moduleRef.get<DatabaseService>(DatabaseService);
      dbService.onModuleInit();
   });

   it("should be defined", () => {
      expect(dbService).toBeDefined();
   });

   it("should define the db property", async () => {
      expect(dbService.db).toBeDefined();
   });

   it("should be able to connect to the database", async () => {
      const result = await dbService.db.run(sql`SELECT 1 AS result`);
      expect(result.rows[0].result).toBe(1);
   });
});
