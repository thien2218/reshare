import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "../post.service";
import { DatabaseService } from "src/database/database.service";
import { SelectPostDto } from "src/schemas/post.schema";
import { and, eq, placeholder } from "drizzle-orm";
import * as schema from "../../schemas";
import { selectPostStub } from "./post.stub";
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

   describe("create", () => {});

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

   describe("update", () => {});

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
