import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "../article.service";
import * as schema from "../../schemas";
import { DatabaseModule } from "src/database/database.module";
import { SelectArticleDto } from "src/schemas/article.schema";
import { and, eq, placeholder } from "drizzle-orm";
import {
   createArticleStub,
   selectArticleStub,
   updateArticleStub
} from "./article.stub";
import { BadRequestException, NotFoundException } from "@nestjs/common";
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

   describe("findOneById", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(service.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         article = await service.findOneById("1");
      });

      it("should select the article with the given id", () => {
         expect(dbService.db.query.articles.findFirst).toBeCalledWith({
            where: eq(schema.articles.id, placeholder("id"))
         });
      });

      it("should prepare the SQL statement", () => {
         expect(dbService.db.query.articles.findFirst().prepare).toBeCalled();
      });

      it("should get the article with prepared statement", () => {
         expect(
            dbService.db.query.articles.findFirst().prepare().get
         ).toBeCalledWith({ id: "1" });
      });

      it("should throw an exception if the article is not found", async () => {
         jest
            .spyOn(dbService.db.query.articles.findFirst().prepare(), "get")
            .mockResolvedValueOnce(undefined);

         await expect(service.findOneById("1")).rejects.toThrow(
            NotFoundException
         );
      });

      it("should return the article", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("create", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(service.create).toBeDefined();
      });

      beforeEach(async () => {
         article = await service.create("1", createArticleStub());
      });

      it("should insert the article to the db", () => {
         expect(dbService.db.insert).toBeCalledWith(schema.articles);
         expect(dbService.db.insert(schema.articles).values).toBeCalled();
         expect(
            dbService.db.insert(schema.articles).values({} as any).prepare
         ).toBeCalled();
         expect(
            dbService.db
               .insert(schema.articles)
               .values({} as any)
               .prepare().get
         ).toBeCalled();
      });

      it("should return the created article", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("update", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(service.update).toBeDefined();
      });

      beforeEach(async () => {
         article = await service.update("1", "2", updateArticleStub());
      });

      it("should update the article", () => {
         expect(dbService.db.update).toBeCalledWith(schema.articles);
         expect(dbService.db.update({} as any).set).toBeCalled();

         expect(
            dbService.db.update({} as any).set({} as any).where
         ).toBeCalledWith(
            and(eq(schema.articles.id, "1"), eq(schema.articles.authorId, "2"))
         );

         expect(
            dbService.db.update({} as any).set({} as any).returning
         ).toBeCalled();

         expect(
            dbService.db
               .update({} as any)
               .set({} as any)
               .returning().get
         ).toBeCalled();
      });

      it("should throw an error when an article is not found", async () => {
         jest
            .spyOn(dbService.db.update({} as any).set({} as any), "get")
            .mockResolvedValueOnce(undefined as any);

         await expect(
            service.update("1", "2", updateArticleStub())
         ).rejects.toThrow(BadRequestException);
      });

      it("should return the updated article", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("remove", () => {
      it("should be defined", () => {
         expect(service.remove).toBeDefined();
      });

      beforeEach(async () => {
         await service.remove("1", "2");
      });

      it("should remove the article", async () => {
         expect(dbService.db.delete).toBeCalledWith(schema.articles);
         expect(dbService.db.delete({} as any).where).toBeCalledWith(
            and(eq(schema.articles.id, "1"), eq(schema.articles.authorId, "2"))
         );
         expect(dbService.db.delete({} as any).returning).toBeCalledWith({});
         expect(dbService.db.delete({} as any).returning().get).toBeCalled();
      });

      it("should throw an error when an article is not found", async () => {
         jest
            .spyOn(dbService.db.delete({} as any).returning(), "get")
            .mockResolvedValueOnce(undefined);

         await expect(service.remove("1", "2")).rejects.toThrow(
            BadRequestException
         );
      });
   });
});
