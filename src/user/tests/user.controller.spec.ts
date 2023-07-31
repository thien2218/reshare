import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { userStub } from "./stubs/user.stub";

jest.mock("../user.service");

describe("UserController", () => {
   let controller: UserController;
   let service: UserService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [UserController],
         providers: [UserService]
      }).compile();

      controller = module.get<UserController>(UserController);
      service = module.get<UserService>(UserService);
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(controller).toBeDefined();
   });

   describe("findOneById", () => {
      it("should be defined", () => {
         expect(controller.findOneById).toBeDefined();
      });

      let user;

      beforeEach(async () => {
         user = await controller.findOneById(userStub().id);
      });

      it("should call userService.findOneById function with user id", () => {
         expect(service.findOneById).toBeCalledWith(userStub().id);
      });

      it("should return a user object", () => {
         expect(user).toEqual(userStub());
      });
   });
});
