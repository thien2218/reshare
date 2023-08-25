import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "../post.service";
import { DatabaseService } from "src/database/database.service";
import { SelectPostDto } from "src/schemas/post.schema";
import { and, eq, placeholder } from "drizzle-orm";
import * as schema from "../../schemas";
import { createPostStub, selectPostStub, updatePostStub } from "./post.stub";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";

jest.mock("../../database/database.service");

describe("PostService", () => {
   let service: PostService;
   let dbService: DatabaseService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [PostService],
         imports: [DatabaseModule]
      }).compile();

      dbService = module.get<DatabaseService>(DatabaseService);
      service = module.get<PostService>(PostService);

      jest.spyOn(dbService.db, "get").mockResolvedValue(selectPostStub());
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
         selectPostDto = await service.create("userId", createPostStub());
      });

      it("should make a db query with correct params", async () => {
         expect(dbService.db.insert).toBeCalledWith(schema.posts);
         expect(dbService.db.insert({} as any).values).toBeCalled();

         expect(
            dbService.db.insert({} as any).values({} as any).returning
         ).toBeCalled();

         expect(
            dbService.db.insert({} as any).values({} as any).prepare
         ).toBeCalled();

         expect(dbService.db.get).toBeCalled();
      });

      it("should throw an exception when userId is invalid", async () => {
         jest
            .spyOn(dbService.db, "get")
            .mockResolvedValueOnce(undefined as any);

         await expect(
            service.create("userId", createPostStub())
         ).rejects.toThrow(BadRequestException);
      });

      it("should return the created post", async () => {
         expect(selectPostDto).toEqual(selectPostStub());
      });
   });

   describe("findOneById", () => {
      let selectPostDto: SelectPostDto;

      it("should be defined", () => {
         expect(service.findOneById).toBeDefined();
      });

      beforeEach(async () => {
         selectPostDto = await service.findOneById("id", "userId");
      });

      it("should make a db query with correct params", () => {
         expect(dbService.db.query.posts.findFirst).toBeCalledWith({
            where: and(
               eq(schema.posts.id, placeholder("id")),
               eq(schema.posts.authorId, placeholder("userId"))
            )
         });

         expect(dbService.db.query.posts.findFirst().prepare).toBeCalled();

         expect(
            dbService.db.query.posts.findFirst().prepare().get
         ).toBeCalledWith({
            id: "id",
            userId: "userId"
         });
      });

      it("should throw an exception if post is not found", async () => {
         jest
            .spyOn(dbService.db.query.posts.findFirst().prepare(), "get")
            .mockResolvedValueOnce(undefined);

         await expect(service.findOneById("id", "userId")).rejects.toThrow(
            NotFoundException
         );
      });

      it("should return the created post", () => {
         expect(selectPostDto).toEqual(selectPostStub());
      });
   });

   describe("update", () => {
      let selectPostDto: SelectPostDto;

      it("should be defined", () => {
         expect(service.update).toBeDefined();
      });

      beforeEach(async () => {
         selectPostDto = await service.update("id", "userId", updatePostStub());
      });

      it("should make a db query with correct params", () => {
         expect(dbService.db.update).toBeCalledWith(schema.posts);
         expect(dbService.db.update({} as any).set).toBeCalledWith(
            updatePostStub()
         );

         expect(
            dbService.db.update({} as any).set({} as any).where
         ).toBeCalledWith(
            and(
               eq(schema.posts.id, placeholder("id")),
               eq(schema.posts.authorId, placeholder("userId"))
            )
         );

         expect(
            dbService.db.update({} as any).set({} as any).returning
         ).toBeCalled();

         expect(
            dbService.db.update({} as any).set({} as any).prepare
         ).toBeCalled();

         expect(
            dbService.db
               .update({} as any)
               .set({} as any)
               .returning().get
         ).toBeCalledWith({
            id: "id",
            userId: "userId"
         });
      });

      it("should throw an exception if post is not found", async () => {
         jest
            .spyOn(dbService.db, "get")
            .mockResolvedValueOnce(undefined as any);

         await expect(
            service.update("id", "userId", updatePostStub())
         ).rejects.toThrow(BadRequestException);
      });

      it("should return the created post", () => {
         expect(selectPostDto).toEqual(selectPostStub());
      });
   });

   describe("remove", () => {
      it("should be defined", () => {
         expect(service.remove).toBeDefined();
      });

      it("should make a db query with correct params", async () => {
         await service.remove("id", "userId");

         expect(dbService.db.delete).toBeCalledWith(schema.posts);

         expect(dbService.db.delete({} as any).where).toBeCalledWith(
            and(eq(schema.posts.id, "id"), eq(schema.posts.authorId, "userId"))
         );

         expect(dbService.db.delete({} as any).returning).toBeCalledWith({});
         expect(dbService.db.delete({} as any).get).toBeCalled();
      });

      it("should throw an exception if post is not found", async () => {
         jest
            .spyOn(dbService.db.delete({} as any), "get")
            .mockResolvedValueOnce(undefined as any);

         await expect(service.remove("id", "userId")).rejects.toThrow(
            BadRequestException
         );
      });
   });
});
