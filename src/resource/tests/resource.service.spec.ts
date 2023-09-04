import { Test, TestingModule } from "@nestjs/testing";
import { ResourceService } from "../resource.service";
import { DatabaseService } from "src/database/database.service";
import { DatabaseModule } from "src/database/database.module";
import { updateResourceStub } from "./resource.stub";
import { resources } from "src/database/tables";
import { and, eq, placeholder } from "drizzle-orm";
import { BadRequestException } from "@nestjs/common";

jest.mock("../../database/database.service");

describe("ResourceService", () => {
   let service: ResourceService;
   let dbService: DatabaseService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [ResourceService],
         imports: [DatabaseModule]
      }).compile();

      service = module.get<ResourceService>(ResourceService);
      dbService = module.get<DatabaseService>(DatabaseService);

      jest
         .spyOn(dbService.db, "run")
         .mockImplementation(() => ({ rowsAffected: 1 } as any));
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });

   describe("update", () => {
      it("should be defined", () => {
         expect(service.update).toBeDefined();
      });

      beforeEach(async () => {
         await service.update("id", "userId", updateResourceStub());
      });

      it("should make a database query with correct params", () => {
         expect(dbService.db.update).toBeCalledWith(resources);
         expect(dbService.db.update({} as any).set).toBeCalledWith(
            updateResourceStub()
         );

         expect(
            dbService.db.update({} as any).set({} as any).where
         ).toBeCalledWith(
            and(
               eq(resources.id, placeholder("id")),
               eq(resources.authorId, placeholder("userId"))
            )
         );

         expect(
            dbService.db.update({} as any).set({} as any).prepare
         ).toBeCalled();

         expect(dbService.db.run).toBeCalledWith({
            id: "id",
            userId: "userId"
         });
      });

      it("should throw an exception if no rows were affected", async () => {
         jest
            .spyOn(dbService.db, "run")
            .mockImplementation(() => ({ rowsAffected: 0 } as any));

         await expect(
            service.update("id", "userId", updateResourceStub())
         ).rejects.toThrowError(BadRequestException);
      });
   });

   describe("react", () => {
      it("should be defined", () => {
         expect(service.react).toBeDefined();
      });

      it("should start a database transaction", async () => {
         await service.react("id", "userId", "like");
         expect(dbService.db.transaction).toBeCalled();
      });
   });

   describe("unreact", () => {
      it("should be defined", () => {
         expect(service.unreact).toBeDefined();
      });

      it("should start a database transaction", async () => {
         await service.unreact("id", "userId", "like");
         expect(dbService.db.transaction).toBeCalled();
      });
   });
});
