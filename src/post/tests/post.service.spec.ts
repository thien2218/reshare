import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "../post.service";
import { DatabaseService } from "src/database/database.service";
import {
   createPostStub,
   selectPostAllStub,
   selectPostStub,
   updatePostStub
} from "./post.stub";
import { DatabaseModule } from "src/database/database.module";
import { userJwtStub } from "src/user/tests/user.stub";
import { SelectPostDto } from "src/schemas";
import { posts, resources } from "src/database/tables";
import { and, eq, placeholder } from "drizzle-orm";
import { BadRequestException } from "@nestjs/common";

jest.mock("../../database/database.service");

describe("PostService", () => {
   let service: PostService;
   let dbService: DatabaseService;
   let subquery: any;
   const temp: any = {};

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [PostService],
         imports: [DatabaseModule]
      }).compile();

      dbService = module.get<DatabaseService>(DatabaseService);
      service = module.get<PostService>(PostService);
      subquery = dbService.db;

      jest.spyOn(dbService.db, "get").mockResolvedValue(selectPostAllStub());
      jest.spyOn(dbService.db, "run").mockReturnValue({
         rowsAffected: 1
      } as any);
      jest
         .spyOn(dbService.db, "transaction")
         .mockResolvedValue(selectPostAllStub());
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(service).toBeDefined();
   });

   describe("create", () => {
      let selectPostDto: SelectPostDto;

      it("should be defined", () => {
         expect(service.create).toBeDefined();
      });

      beforeEach(async () => {
         selectPostDto = await service.create(userJwtStub(), createPostStub());
      });

      it("should create a database transaction", () => {
         expect(dbService.db.transaction).toBeCalled();
      });

      it("should return the created post", () => {
         expect(selectPostDto).toEqual(selectPostStub());
      });
   });

   describe("findOneById", () => {
      let selectPostDto: SelectPostDto;

      it("should be defined", () => {
         expect(service.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         selectPostDto = await service.findOneById("id");
      });

      it("should make a database query with correct params", () => {
         expect(dbService.db.select).toBeCalled();
         expect(dbService.db.select().from).toBeCalledWith(posts);
         expect(dbService.db.select().from(temp).where).toBeCalledWith(
            eq(posts.id, placeholder("id"))
         );
         expect(dbService.db.select().from(temp).innerJoin).toBeCalledTimes(2);
         expect(dbService.db.select().from(temp).prepare).toBeCalled();
         expect(dbService.db.get).toBeCalledWith({ id: "id" });
      });

      it("should return the post", () => {
         expect(selectPostDto).toEqual(selectPostStub());
      });
   });

   describe("update", () => {
      it("should be defined", () => {
         expect(service.update).toBeDefined();
      });

      beforeEach(async () => {
         await service.update("id", userJwtStub().sub, updatePostStub());
      });

      it("should create a subquery", () => {
         expect(dbService.db.select).toBeCalled();
         expect(dbService.db.select().from).toBeCalledWith(resources);
         expect(dbService.db.select().from(temp).where).toBeCalledWith(
            and(
               eq(resources.postId, placeholder("id")),
               eq(resources.authorId, placeholder("userId"))
            )
         );
      });

      it("should make a database query with correct params", () => {
         expect(dbService.db.update).toBeCalled();
         expect(dbService.db.update(temp).set).toBeCalledWith(updatePostStub());

         expect(dbService.db.update(temp).set(temp).where).toBeCalledWith(
            eq(posts.id, subquery)
         );

         expect(dbService.db.update(temp).set(temp).prepare).toBeCalled();
         expect(dbService.db.run).toBeCalledWith({
            id: "id",
            userId: userJwtStub().sub
         });
      });

      it("should throw an error if no rows were updated", async () => {
         jest.spyOn(dbService.db, "run").mockReturnValue({
            rowsAffected: 0
         } as any);

         await expect(
            service.update("id", userJwtStub().sub, updatePostStub())
         ).rejects.toThrowError(BadRequestException);
      });
   });

   describe("remove", () => {
      it("should be defined", () => {
         expect(service.remove).toBeDefined();
      });

      beforeEach(async () => {
         await service.remove("id", userJwtStub().sub);
      });

      it("should create a subquery", () => {
         expect(dbService.db.select).toBeCalled();
         expect(dbService.db.select().from).toBeCalledWith(resources);
         expect(dbService.db.select().from(temp).where).toBeCalledWith(
            and(
               eq(resources.postId, "id"),
               eq(resources.authorId, userJwtStub().sub)
            )
         );
      });

      it("should make a database query with correct params", () => {
         expect(dbService.db.delete).toBeCalledWith(posts);
         expect(dbService.db.delete(temp).where).toBeCalledWith(
            eq(posts.id, subquery)
         );
         expect(dbService.db.delete(temp).returning).toBeCalled();
         expect(dbService.db.get).toBeCalled();
      });
   });
});
