import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { MockConfigService } from "../__mocks__/config.service";
import { DatabaseService } from "../database.service";

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
   });

   it("should be defined", () => {
      expect(dbService).toBeDefined();
   });
});
