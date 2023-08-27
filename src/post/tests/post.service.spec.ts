import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "../post.service";
import { DatabaseService } from "src/database/database.service";
import { selectPostStub } from "./post.stub";
import { DatabaseModule } from "src/database/database.module";

jest.mock("../../database/database.service");

describe("PostService", () => {
   let service: PostService;
   let dbService: DatabaseService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [PostService],
         imports: [DatabaseModule]
      }).compile();

      dbService = module.get<DatabaseService>(DatabaseService);
      service = module.get<PostService>(PostService);

      jest.spyOn(dbService.db, "get").mockResolvedValue(selectPostStub());
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });
});
