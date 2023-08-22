import { Test, TestingModule } from "@nestjs/testing";
import { ArticleController } from "../article.controller";
import { ArticleService } from "../article.service";
import {
   selectArticleStub,
   createArticleStub,
   updateArticleStub
} from "./article.stub";
import { SelectArticleDto } from "src/schemas/article.schema";

jest.mock("../article.service");

describe("ArticleController", () => {
   let controller: ArticleController;
   let service: ArticleService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [ArticleController],
         providers: [ArticleService]
      }).compile();

      service = module.get<ArticleService>(ArticleService);
      controller = module.get<ArticleController>(ArticleController);
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(controller).toBeDefined();
   });

   describe("findOneById", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(controller.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         article = await controller.findOneById("1");
      });

      it("should call service.findOneById with correct params", () => {
         expect(service.findOneById).toBeCalledWith("1");
      });

      it("should return correct article with the provided id", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("create", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(controller.create).toBeDefined();
      });

      beforeEach(async () => {
         article = await controller.create(createArticleStub());
      });

      it("should call service.create with correct params", () => {
         expect(service.create).toBeCalledWith(createArticleStub());
      });

      it("should return the created article", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("update", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(controller.update).toBeDefined();
      });

      beforeEach(async () => {
         article = await controller.update("1", updateArticleStub());
      });

      it("should call service.update with correct params", () => {
         expect(service.update).toBeCalledWith("1", updateArticleStub());
      });

      it("should return the updated article", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("remove", () => {
      let message: string;

      it("should be defined", () => {
         expect(controller.remove).toBeDefined();
      });

      beforeEach(async () => {
         message = await controller.remove("1");
      });

      it("should call service.remove with correct params", async () => {
         expect(service.remove).toBeCalledWith("1");
      });

      it("should return the correct message", () => {
         expect(message).toEqual("Article successfully deleted");
      });
   });
});
