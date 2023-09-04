import { Test, TestingModule } from "@nestjs/testing";
import { ResourceController } from "../resource.controller";
import { ResourceService } from "../resource.service";
import { userJwtStub } from "src/user/tests/user.stub";
import { updateResourceStub } from "./resource.stub";

jest.mock("../resource.service");

describe("ResourceController", () => {
   let controller: ResourceController;
   let service: ResourceService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [ResourceController],
         providers: [ResourceService]
      }).compile();

      controller = module.get<ResourceController>(ResourceController);
      service = module.get<ResourceService>(ResourceService);
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(controller).toBeDefined();
   });

   describe("update", () => {
      it("should be defined", () => {
         expect(controller.update).toBeDefined();
      });

      it("should call service.update", async () => {
         await controller.update("id", userJwtStub(), updateResourceStub());

         expect(service.update).toBeCalledWith(
            "id",
            userJwtStub().sub,
            updateResourceStub()
         );
      });
   });

   describe("react", () => {
      it("should be defined", () => {
         expect(controller.react).toBeDefined();
      });

      it("should call service.react", async () => {
         await controller.react("id", userJwtStub(), "like");

         expect(service.react).toBeCalledWith("id", userJwtStub().sub, "like");
      });
   });

   describe("unreact", () => {
      it("should be defined", () => {
         expect(controller.unreact).toBeDefined();
      });

      it("should call service.unreact", async () => {
         await controller.unreact("id", userJwtStub(), "like");

         expect(service.unreact).toBeCalledWith(
            "id",
            userJwtStub().sub,
            "like"
         );
      });
   });
});
