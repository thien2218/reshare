import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service";
import { SelectUserDto } from "src/schemas/user.schema";
import { selectUserStub, updateUserStub } from "./user.stub";
import { DatabaseModule } from "src/database/database.module";
import { eq, placeholder } from "drizzle-orm";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { users } from "src/database/tables";

jest.mock("../../database/database.service");

describe("UserService", () => {
   let service: UserService;
   let dbService: DatabaseService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule],
         providers: [UserService]
      }).compile();

      service = module.get<UserService>(UserService);
      dbService = module.get<DatabaseService>(DatabaseService);

      jest
         .spyOn(dbService.db.update({} as any).set({} as any), "get")
         .mockResolvedValue(selectUserStub() as any);
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });

   describe("findOneById", () => {
      let usersData: SelectUserDto;

      it("should be defined", () => {
         expect(service.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         usersData = await service.findOneById("1");
      });

      it("should make a database query to select one user with a user id", () => {
         expect(dbService.db.query.users.findFirst).toBeCalledWith({
            where: eq(users.id, placeholder("id"))
         });
      });

      it("should call .get method of prepared statement", () => {
         expect(dbService.db.query.users.findFirst().prepare).toBeCalled();
         expect(
            dbService.db.query.users.findFirst().prepare().get
         ).toBeCalledWith({ id: "1" });
      });

      it("should throw an exception when no user is found", async () => {
         jest
            .spyOn(dbService.db.query.users.findFirst().prepare(), "get")
            .mockResolvedValueOnce(undefined);

         await expect(service.findOneById("1")).rejects.toThrow(
            NotFoundException
         );
      });

      it("should return a user object", () => {
         expect(usersData).toEqual(selectUserStub());
      });
   });

   describe("update", () => {
      let selectUserDto: SelectUserDto;

      it("should be defined", () => {
         expect(service.update).toBeDefined();
      });

      beforeEach(async () => {
         selectUserDto = await service.update("id", updateUserStub());
      });

      it("should call dbService.db.update with correct parameters", () => {
         expect(dbService.db.update).toBeCalledWith(users);

         expect(dbService.db.update({} as any).set).toBeCalledWith(
            updateUserStub()
         );

         expect(
            dbService.db.update({} as any).set({} as any).where
         ).toBeCalledWith(eq(users.id, "id"));

         expect(
            dbService.db.update({} as any).set({} as any).returning
         ).toBeCalled();

         expect(dbService.db.update({} as any).set({} as any).get).toBeCalled();
      });

      it("should return the updated user data", () => {
         expect(selectUserDto).toEqual(selectUserStub());
      });

      it("should throw BadRequestException if user id is invalid", async () => {
         jest
            .spyOn(dbService.db.update({} as any).set({} as any), "get")
            .mockResolvedValueOnce(undefined as any);

         await expect(service.update("id", {})).rejects.toThrow(
            BadRequestException
         );
      });
   });

   describe("remove", () => {
      it("should be defined", () => {
         expect(service.remove).toBeDefined();
      });

      beforeEach(async () => {
         await service.remove("id");
      });

      it("should call dbService.db.delete with correct parameters", async () => {
         expect(dbService.db.delete).toBeCalledWith(users);
         expect(dbService.db.delete({} as any).where).toBeCalledWith(
            eq(users.id, "id")
         );
         expect(dbService.db.delete({} as any).returning).toBeCalledWith({});
         expect(dbService.db.delete({} as any).get).toBeCalled();
      });

      it("should throw BadRequestException if user id is invalid", async () => {
         jest
            .spyOn(dbService.db.delete({} as any).returning({}), "get")
            .mockResolvedValue(undefined);

         await expect(service.remove("id")).rejects.toThrow(
            BadRequestException
         );
      });
   });
});
