import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service";
import { SelectUserDto, UpdateUserDto } from "src/schemas/user.schema";
import { userStub, userStubs } from "./user.stub";
import { DatabaseModule } from "src/database/database.module";
import { DB_CONNECTION } from "src/constants";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { MockDbConnection } from "../../database/__mocks__/database.service";
import * as schema from "../../schemas";
import { eq, placeholder } from "drizzle-orm";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("UserService", () => {
   let service: UserService;
   let dbService: LibSQLDatabase<typeof schema>;

   const placeholders = {
      limit: placeholder("limit"),
      offset: placeholder("offset")
   };

   const pagination = {
      offset: 0,
      limit: 20
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule],
         providers: [UserService]
      })
         .overrideProvider(DB_CONNECTION)
         .useValue(MockDbConnection)
         .compile();

      service = module.get(UserService);
      dbService = module.get(DB_CONNECTION);
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });

   describe("findMany", () => {
      let usersData: SelectUserDto[];

      it("should be defined", () => {
         expect(service.findMany).toBeDefined();
      });

      beforeEach(async () => {
         usersData = await service.findMany(0, 20);
      });

      it("should make a database query to select many users with correct arguments", () => {
         expect(dbService.query.users.findMany).toBeCalledWith(placeholders);
      });

      it("should call .all method of prepared statement with correct query", () => {
         expect(dbService.query.users.findMany().prepare).toBeCalled();
         expect(dbService.query.users.findMany().prepare().all).toBeCalledWith(
            pagination
         );
      });

      it("should throw a 404 not found exception when no user is found", async () => {
         MockDbConnection.query.users
            .findMany()
            .prepare()
            .all.mockImplementationOnce(() => Promise.resolve([]));

         await expect(service.findMany(0, 20)).rejects.toThrowError(
            NotFoundException
         );
      });

      it("should return an array of user objects", () => {
         expect(usersData).toEqual(userStubs());
      });
   });

   describe("findOneById", () => {
      let usersData: SelectUserDto;

      it("should be defined", () => {
         expect(service.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         usersData = await service.findOneById(userStub().id);
      });

      it("should make a database query to select one user with a user id", () => {
         expect(dbService.query.users.findFirst).toBeCalledWith({
            where: eq(schema.users.id, userStub().id)
         });
      });

      it("should call .get method of prepared statement", () => {
         expect(dbService.query.users.findMany().prepare).toBeCalled();
         expect(dbService.query.users.findMany().prepare().get).toBeCalled();
      });

      it("should throw a 404 not found exception when no user is found", async () => {
         MockDbConnection.query.users.get.mockImplementationOnce(() =>
            Promise.resolve(undefined)
         );

         await expect(service.findOneById(userStub().id)).rejects.toThrowError(
            NotFoundException
         );
      });

      it("should return a user object", () => {
         expect(usersData).toEqual(userStub());
      });
   });

   describe("update", () => {
      let id: string;
      let updateUserDto: UpdateUserDto;
      let selectUserDto: SelectUserDto;

      it("should be defined", () => {
         expect(service.update).toBeDefined();
      });

      beforeEach(async () => {
         id = "testId";
         updateUserDto = { firstName: "testName" };
         selectUserDto = await service.update(id, updateUserDto);
      });

      it("should call dbService.update with correct parameters", () => {
         expect(dbService.update).toBeCalledWith(schema.users);

         expect(dbService.update(schema.users).set).toBeCalledWith(
            updateUserDto
         );

         expect(
            dbService.update(schema.users).set(updateUserDto).where
         ).toBeCalledWith(eq(schema.users.id, placeholder("id")));

         expect(
            dbService.update(schema.users).set(updateUserDto).returning
         ).toBeCalled();

         expect(
            dbService.update(schema.users).set(updateUserDto).prepare
         ).toBeCalled();

         expect(
            dbService.update(schema.users).set(updateUserDto).get
         ).toBeCalledWith({ id });
      });

      it("should return the updated user data", () => {
         expect(selectUserDto).toEqual(userStub());
      });

      it("should throw BadRequestException if user id is invalid", async () => {
         MockDbConnection.get.mockImplementationOnce(() =>
            Promise.resolve(undefined)
         );

         await expect(
            service.update("invalidId", updateUserDto)
         ).rejects.toThrow(BadRequestException);
      });
   });

   describe("remove", () => {
      let id: string;
      let result: string;

      beforeEach(async () => {
         id = "testId";
         result = await service.remove(id);
      });

      it("should call dbService.delete with correct parameters", () => {
         expect(dbService.delete).toBeCalledWith(schema.users);

         expect(dbService.delete(schema.users).where).toBeCalledWith(
            eq(schema.users.id, placeholder("id"))
         );

         expect(dbService.delete(schema.users).returning).toBeCalledWith({
            deletedId: schema.users.id
         });

         expect(dbService.delete(schema.users).get).toBeCalledWith({ id });
      });

      it("should return a success message", () => {
         expect(result).toEqual("User deleted successfully!");
      });

      it("should throw BadRequestException if user id is invalid", async () => {
         MockDbConnection.get.mockImplementationOnce(() =>
            Promise.resolve(undefined)
         );

         await expect(service.remove("invalidId")).rejects.toThrow(
            BadRequestException
         );
      });
   });
});
