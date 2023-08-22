import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "../article.service";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "../../schemas";
import { DatabaseModule } from "src/database/database.module";
import { DB_CONNECTION } from "src/constants";
import { MockDbConnection } from "src/database/__mocks__/database.service";
import { SelectArticleDto } from "src/schemas/article.schema";
import { eq, placeholder } from "drizzle-orm";
import { selectArticleStub } from "./article.stub";
import { NotFoundException } from "@nestjs/common";

describe("ArticleService", () => {
   let service: ArticleService;
   let dbService: LibSQLDatabase<typeof schema>;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule],
         providers: [ArticleService]
      })
         .overrideProvider(DB_CONNECTION)
         .useValue(MockDbConnection)
         .compile();

      dbService = module.get<LibSQLDatabase<typeof schema>>(DB_CONNECTION);
      service = module.get<ArticleService>(ArticleService);
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });

   describe("findOneById", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(service.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         article = await service.findOneById("1");
      });

      it("should select the article with the given id", () => {
         expect(dbService.query.articles.findFirst).toBeCalledWith({
            where: eq(schema.articles.id, placeholder("id"))
         });
      });

      it("should prepare the SQL statement", () => {
         expect(dbService.query.articles.findFirst().prepare).toBeCalled();
      });

      it("should get the article with prepared statement", () => {
         expect(
            dbService.query.articles.findFirst().prepare().get
         ).toBeCalledWith({ id: "1" });
      });

      it("should throw an exception if the article is not found", async () => {
         MockDbConnection.query.articles
            .findFirst()
            .prepare()
            .get.mockResolvedValueOnce(undefined);

         await expect(service.findOneById("1")).rejects.toThrow(
            NotFoundException
         );
      });

      it("should return the article", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });
});
