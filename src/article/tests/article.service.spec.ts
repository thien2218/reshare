import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "../article.service";
import { DatabaseModule } from "src/database/database.module";
import { selectArticleStub } from "./article.stub";
import { DatabaseService } from "src/database/database.service";

jest.mock("../../database/database.service");

describe("ArticleService", () => {
   let service: ArticleService;
   let dbService: DatabaseService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule],
         providers: [ArticleService]
      }).compile();

      dbService = module.get<DatabaseService>(DatabaseService);
      service = module.get<ArticleService>(ArticleService);

      jest.spyOn(dbService.db, "get").mockResolvedValue(selectArticleStub());
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });
});
