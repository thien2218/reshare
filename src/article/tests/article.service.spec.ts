import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "../article.service";
import { DatabaseModule } from "src/database/database.module";
import {
   createArticleStub,
   selectArticleAllStub,
   selectArticleStub,
   updateArticleStub
} from "./article.stub";
import { DatabaseService } from "src/database/database.service";
import { SelectArticleDto } from "src/schemas";
import { userJwtStub } from "src/user/tests/user.stub";
import { articles, resources } from "src/database/tables";
import { and, eq, placeholder } from "drizzle-orm";
import { BadRequestException } from "@nestjs/common";

jest.mock("../../database/database.service");

describe("ArticleService", () => {
   let service: ArticleService;
   let dbService: DatabaseService;
   let subquery: any;
   const temp: any = {};

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule],
         providers: [ArticleService]
      }).compile();

      dbService = module.get<DatabaseService>(DatabaseService);
      service = module.get<ArticleService>(ArticleService);
      subquery = dbService.db;

      jest.spyOn(dbService.db, "get").mockResolvedValue(selectArticleAllStub());
      jest.spyOn(dbService.db, "run").mockReturnValue({
         rowsAffected: 1
      } as any);
      jest
         .spyOn(dbService.db, "transaction")
         .mockResolvedValue(selectArticleAllStub());
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });

   describe("create", () => {
      let selectArticleDto: SelectArticleDto;

      it("should be defined", () => {
         expect(service.create).toBeDefined();
      });

      beforeEach(async () => {
         selectArticleDto = await service.create(
            userJwtStub(),
            createArticleStub()
         );
      });

      it("should create a database transaction", () => {
         expect(dbService.db.transaction).toBeCalled();
      });

      it("should return the created article", () => {
         expect(selectArticleDto).toEqual(selectArticleStub());
      });
   });

   describe("findOneById", () => {
      let selectArticleDto: SelectArticleDto;

      it("should be defined", () => {
         expect(service.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         selectArticleDto = await service.findOneById("id");
      });

      it("should make a database query with correct params", () => {
         expect(dbService.db.select).toBeCalled();
         expect(dbService.db.select().from).toBeCalledWith(articles);
         expect(dbService.db.select().from(temp).where).toBeCalledWith(
            eq(articles.id, placeholder("id"))
         );
         expect(dbService.db.select().from(temp).innerJoin).toBeCalledTimes(2);
         expect(dbService.db.select().from(temp).prepare).toBeCalled();
         expect(dbService.db.get).toBeCalledWith({ id: "id" });
      });

      it("should return the article", () => {
         expect(selectArticleDto).toEqual(selectArticleStub());
      });
   });

   describe("update", () => {
      it("should be defined", () => {
         expect(service.update).toBeDefined();
      });

      beforeEach(async () => {
         await service.update("id", userJwtStub().sub, updateArticleStub());
      });

      it("should create a subquery", () => {
         expect(dbService.db.select).toBeCalled();
         expect(dbService.db.select().from).toBeCalledWith(resources);
         expect(dbService.db.select().from(temp).where).toBeCalledWith(
            and(
               eq(resources.articleId, placeholder("id")),
               eq(resources.authorId, placeholder("userId"))
            )
         );
      });

      it("should make a database query with correct params", () => {
         expect(dbService.db.update).toBeCalled();
         expect(dbService.db.update(temp).set).toBeCalledWith(
            updateArticleStub()
         );

         expect(dbService.db.update(temp).set(temp).where).toBeCalledWith(
            eq(articles.id, subquery)
         );

         expect(dbService.db.update(temp).set(temp).prepare).toBeCalled();
         expect(dbService.db.run).toBeCalledWith({
            id: "id",
            userId: userJwtStub().sub
         });
      });

      it("should throw an error if no rows were updated", async () => {
         jest.spyOn(dbService.db, "run").mockReturnValue({
            rowsAffected: 0
         } as any);

         await expect(
            service.update("id", userJwtStub().sub, updateArticleStub())
         ).rejects.toThrowError(BadRequestException);
      });
   });

   describe("remove", () => {
      it("should be defined", () => {
         expect(service.remove).toBeDefined();
      });

      beforeEach(async () => {
         await service.remove("id", userJwtStub().sub);
      });

      it("should create a subquery", () => {
         expect(dbService.db.select).toBeCalled();
         expect(dbService.db.select().from).toBeCalledWith(resources);
         expect(dbService.db.select().from(temp).where).toBeCalledWith(
            and(
               eq(resources.articleId, "id"),
               eq(resources.authorId, userJwtStub().sub)
            )
         );
      });

      it("should make a database query with correct params", () => {
         expect(dbService.db.delete).toBeCalledWith(articles);
         expect(dbService.db.delete(temp).where).toBeCalledWith(
            eq(articles.id, subquery)
         );
         expect(dbService.db.delete(temp).returning).toBeCalled();
         expect(dbService.db.get).toBeCalled();
      });
   });
});
