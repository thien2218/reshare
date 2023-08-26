import { Test, TestingModule } from "@nestjs/testing";
import { ArticleController } from "../article.controller";
import { ArticleService } from "../article.service";
import {
   selectArticleStub,
   createArticleStub,
   updateArticleStub
} from "./article.stub";
import { SelectArticleDto } from "src/schemas/tables/articles";
import { userJwtStub } from "src/user/tests/user.stub";

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

   describe("create", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(controller.create).toBeDefined();
      });

      beforeEach(async () => {
         article = await controller.create(userJwtStub(), createArticleStub());
      });

      it("should call service.create with correct params", () => {
         expect(service.create).toBeCalledWith(
            userJwtStub().sub,
            createArticleStub()
         );
      });

      it("should return the created article", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("findOneById", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(controller.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         article = await controller.findOneById("id");
      });

      it("should call service.findOneById with correct params", () => {
         expect(service.findOneById).toBeCalledWith("id");
      });

      it("should return correct article with the provided id", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("update", () => {
      let article: SelectArticleDto;

      it("should be defined", () => {
         expect(controller.update).toBeDefined();
      });

      beforeEach(async () => {
         article = await controller.update(
            "id",
            userJwtStub(),
            updateArticleStub()
         );
      });

      it("should call service.update with correct params", () => {
         expect(service.update).toBeCalledWith(
            "id",
            userJwtStub().sub,
            updateArticleStub()
         );
      });

      it("should return the updated article", () => {
         expect(article).toEqual(selectArticleStub());
      });
   });

   describe("remove", () => {
      it("should be defined", () => {
         expect(controller.remove).toBeDefined();
      });

      beforeEach(async () => {
         await controller.remove("id", userJwtStub());
      });

      it("should call service.remove with correct params", async () => {
         expect(service.remove).toBeCalledWith("id", userJwtStub().sub);
      });
   });
});
