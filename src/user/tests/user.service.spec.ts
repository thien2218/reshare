import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service";
import { SelectUserDto } from "src/database/schemas/user.schema";
import { userStub, userStubs } from "./stubs/user.stub";
import { DatabaseModule } from "src/database/database.module";
import { DB_CONNECTION } from "src/constants";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { mockDbService } from "../__mocks__/dbService";
import * as schema from "../../database/schemas";

describe("UserService", () => {
   let service: UserService;
   let dbService: LibSQLDatabase<typeof schema>;

   const pagination = {
      limit: 20,
      offset: 0
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [DatabaseModule],
         providers: [UserService]
      })
         .overrideProvider(DB_CONNECTION)
         .useValue(mockDbService)
         .compile();

      service = module.get(UserService);
      dbService = module.get(DB_CONNECTION);
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });

   describe("findMany", () => {
      let usersData: SelectUserDto[];

      beforeEach(async () => {
         usersData = await service.findMany(1, 20);
      });

      it("should be defined", () => {
         expect(service.findMany).toBeDefined();
      });

      it("should make a database query to select many users with correct arguments", () => {
         expect(dbService.query.users.findMany).toBeCalledWith(pagination);
      });

      it("should return an array of user objects", () => {
         expect(usersData).toEqual(userStubs());
      });
   });

   describe("findOneById", () => {
      let usersData: SelectUserDto;

      beforeEach(async () => {
         usersData = await service.findOneById(userStub().id);
      });

      it("should be defined", () => {
         expect(service.findOneById).toBeDefined();
      });

      it("should return a user object", () => {
         expect(usersData).toEqual(userStub());
      });
   });
});
