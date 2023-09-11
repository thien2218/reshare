import { Test, TestingModule } from "@nestjs/testing";
import { TagController } from "../tag.controller";
import { TagService } from "../tag.service";
import { userJwtStub } from "src/user/tests/user.stub";

jest.mock("../tag.service");

describe("TagController", () => {
   let controller: TagController;
   let service: TagService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [TagController],
         providers: [TagService]
      }).compile();

      controller = module.get<TagController>(TagController);
      service = module.get<TagService>(TagService);

      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(controller).toBeDefined();
   });

   describe("addTags", () => {
      it("should be defined", () => {
         expect(controller.addTags).toBeDefined();
      });

      it("should call service.addTags", async () => {
         await controller.addTags("resId", userJwtStub(), ["tag1", "tag2"]);

         expect(service.addTags).toBeCalledWith("resId", userJwtStub().sub, [
            "tag1",
            "tag2"
         ]);
      });
   });

   describe("removeTags", () => {
      it("should be defined", () => {
         expect(controller.removeTags).toBeDefined();
      });

      it("should call service.removeTags", async () => {
         await controller.removeTags("resId", userJwtStub(), ["tag1", "tag2"]);

         expect(service.removeTags).toBeCalledWith("resId", userJwtStub().sub, [
            "tag1",
            "tag2"
         ]);
      });
   });
});
