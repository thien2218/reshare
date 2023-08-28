import { Test, TestingModule } from "@nestjs/testing";
import { ResourceService } from "../resource.service";
import { DatabaseService } from "src/database/database.service";
import { DatabaseModule } from "src/database/database.module";

describe("ResourceService", () => {
   let service: ResourceService;
   let dbService: DatabaseService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [ResourceService],
         imports: [DatabaseModule]
      }).compile();

      service = module.get<ResourceService>(ResourceService);
      dbService = module.get<DatabaseService>(DatabaseService);
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });
});
