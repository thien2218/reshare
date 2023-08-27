import { Test, TestingModule } from "@nestjs/testing";
import { PostController } from "../post.controller";
import { PostService } from "../post.service";
import { SelectPostDto } from "src/schemas";
import { createPostStub, selectPostStub, updatePostStub } from "./post.stub";
import { userJwtStub } from "src/user/tests/user.stub";

jest.mock("../post.service.ts");

describe("PostController", () => {
   let controller: PostController;
   let service: PostService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [PostController],
         providers: [PostService]
      }).compile();

      service = module.get<PostService>(PostService);
      controller = module.get<PostController>(PostController);
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(controller).toBeDefined();
   });

   describe("create", () => {
      let selectPostDto: SelectPostDto;

      it("should be defined", () => {
         expect(controller.create).toBeDefined();
      });

      beforeEach(async () => {
         selectPostDto = await controller.create(
            userJwtStub(),
            createPostStub()
         );
      });

      it("should call service.create with correct params", () => {
         expect(service.create).toHaveBeenCalledWith(
            userJwtStub().sub,
            createPostStub()
         );
      });

      it("should return the created post", () => {
         expect(selectPostDto).toEqual(selectPostStub());
      });
   });

   describe("findOneById", () => {
      let selectPostDto: SelectPostDto;

      it("should be defined", () => {
         expect(controller.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         selectPostDto = await controller.findOneById("id");
      });

      it("should call service.findOneById with correct params", () => {
         expect(service.findOneById).toHaveBeenCalledWith("id");
      });

      it("should return the post", () => {
         expect(selectPostDto).toEqual(selectPostStub());
      });
   });

   describe("update", () => {
      let selectPostDto: SelectPostDto;

      it("should be defined", () => {
         expect(controller.update).toBeDefined();
      });

      beforeEach(async () => {
         selectPostDto = await controller.update(
            "id",
            userJwtStub(),
            updatePostStub()
         );
      });

      it("should call service.update with correct params", () => {
         expect(service.update).toHaveBeenCalledWith(
            "id",
            userJwtStub().sub,
            updatePostStub()
         );
      });

      it("should return the updated post", () => {
         expect(selectPostDto).toEqual(selectPostStub());
      });
   });

   describe("remove", () => {
      it("should be defined", () => {
         expect(controller.remove).toBeDefined();
      });

      it("should call service.remove with correct params", async () => {
         await controller.remove("id", userJwtStub());
         expect(service.remove).toHaveBeenCalledWith("id", userJwtStub().sub);
      });
   });
});
