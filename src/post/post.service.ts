import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import { and, eq, placeholder } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";
import {
   CreatePostDto,
   SelectPostDto,
   SelectPostSchema,
   UpdatePostDto
} from "src/schemas/post.schema";
import * as schema from "../schemas";
import { selectPostStub } from "./tests/post.stub";

@Injectable()
export class PostService {
   constructor(private readonly dbService: DatabaseService) {}

   async create(
      userId: string,
      createPostDto: CreatePostDto
   ): Promise<SelectPostDto> {
      return selectPostStub();
   }

   async findOneById(id: string, userId: string): Promise<SelectPostDto> {
      const prepare = this.dbService.db.query.posts
         .findFirst({
            where: and(
               eq(schema.posts.id, placeholder("id")),
               eq(schema.posts.authorId, placeholder("userId"))
            )
         })
         .prepare();
      const post = await prepare.get({ id, userId });

      if (!post) throw new NotFoundException();

      const result = SelectPostSchema.parse(post);
      return result;
   }

   async update(
      id: string,
      userId: string,
      updatePostDto: UpdatePostDto
   ): Promise<SelectPostDto> {
      return selectPostStub();
   }

   async remove(id: string, userId: string) {
      const isDeleted = await this.dbService.db
         .delete(schema.posts)
         .where(and(eq(schema.posts.id, id), eq(schema.posts.authorId, userId)))
         .returning({})
         .get();

      if (!isDeleted)
         throw new BadRequestException("Post not found in database");
   }
}
