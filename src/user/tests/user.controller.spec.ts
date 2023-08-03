import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { userStub, userStubs } from "./stubs/user.stub";
import { SelectUserDto } from "src/database/schemas/user.schema";

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

   describe("findMany", () => {
      it("should be defined", () => {
         expect(controller.findMany).toBeDefined();
      });

      let users: SelectUserDto[];
      const page = 1;
      const itemsCount = 10;
      const defaultItemsCount = 20;

      beforeEach(async () => {
         users = await controller.findMany(page, itemsCount);
      });

      it("should call userService.findMany with a page number and an items count", () => {
         expect(service.findMany).toBeCalledWith(page, itemsCount);
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

      it("should call userService.findOneById with user id", () => {
         expect(service.findOneById).toBeCalledWith(userStub().id);
      });

      it("should return a user object", () => {
         expect(user).toEqual(userStub());
      });
   });
});
