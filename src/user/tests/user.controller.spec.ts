import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { userStub, userStubs, userUpdateStub } from "./stubs/user.stub";
import { SelectUserDto } from "src/database/schemas/user.schema";

jest.mock("../user.service");

describe("UserController", () => {
   let controller: UserController;
   let service: UserService;

   const query = {
      search: "hi",
      offset: 0,
      limit: 10
   };

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

   describe("findMany", () => {
      it("should be defined", () => {
         expect(controller.findMany).toBeDefined();
      });

      let users: SelectUserDto[];

      beforeEach(async () => {
         users = await controller.findMany(query);
      });

      it("should call userService.findMany with a page number and a limit", () => {
         expect(service.findMany).toBeCalledWith(0, 10);
      });

      it("should return a list of user objecst", () => {
         expect(users).toEqual(userStubs());
      });
   });

   describe("findOneById", () => {
      it("should be defined", () => {
         expect(controller.findOneById).toBeDefined();
      });

      let user: SelectUserDto;

      beforeEach(async () => {
         user = await controller.findOneById(userStub().id);
      });

      it("should call userService.findOneById with a user id", () => {
         expect(service.findOneById).toBeCalledWith(userStub().id);
      });

      it("should return a user object", () => {
         expect(user).toEqual(userStub());
      });
   });

   describe("update", () => {
      it("should be defined", () => {
         expect(controller.update).toBeDefined();
      });

      let user: SelectUserDto;

      beforeEach(async () => {
         user = await controller.update(userStub().id, userUpdateStub());
      });

      it("should call userService.update with user id", () => {
         expect(service.update).toBeCalledWith(userStub().id, userUpdateStub());
      });

      it("should return a user object", () => {
         expect(user).toEqual(userStub());
      });
   });

   describe("delete", () => {
      it("should be defined", () => {
         expect(controller.remove).toBeDefined();
      });

      let message: string;

      beforeEach(async () => {
         message = await controller.remove(userStub().id);
      });

      it("should call userService.remove with user id", () => {
         expect(service.remove).toBeCalledWith(userStub().id);
      });

      it("should return a user object", () => {
         expect(message).toEqual("User deleted successfully!");
      });
   });
});
