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
import { nanoid } from "nanoid";
import { getTimestamp } from "src/utils/getTimestamp";

@Injectable()
export class PostService {
   constructor(private readonly dbService: DatabaseService) {}

   async create(
      userId: string,
      createPostDto: CreatePostDto
   ): Promise<SelectPostDto> {
      const values = {
         id: nanoid(25),
         authorId: userId,
         ...createPostDto,
         createdAt: getTimestamp(),
         updatedAt: getTimestamp()
      };

      const prepare = this.dbService.db
         .insert(schema.posts)
         .values(this.postPlaceholders())
         .returning()
         .prepare();
      const post = await prepare.get(values);

      if (!post) throw new BadRequestException("Invalid user id");

      const result = SelectPostSchema.parse(post);
      return result;
   }

   async findOneById(id: string): Promise<SelectPostDto> {
      const prepare = this.dbService.db.query.posts
         .findFirst({
            where: and(eq(schema.posts.id, placeholder("id")))
         })
         .prepare();

      const post = await prepare.get({ id });
      if (!post) throw new NotFoundException();

      const result = SelectPostSchema.parse(post);
      return result;
   }

   async update(
      id: string,
      userId: string,
      updatePostDto: UpdatePostDto
   ): Promise<SelectPostDto> {
      const prepared = this.dbService.db
         .update(schema.posts)
         .set(updatePostDto)
         .where(
            and(
               eq(schema.posts.id, placeholder("id")),
               eq(schema.posts.authorId, placeholder("userId"))
            )
         )
         .returning()
         .prepare();
      const post = await prepared.get({ id, userId });

      if (!post) throw new BadRequestException("Invalid post id or user id");

      const result = SelectPostSchema.parse(post);
      return result;
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

   // PRIVATE

   private postPlaceholders() {
      return {
         id: placeholder("id"),
         authorId: placeholder("authorId"),
         content: placeholder("content"),
         imgAttachments: placeholder("imgAttachments"),
         urlAttachments: placeholder("urlAttachments"),

         scope: placeholder("scope"),
         allowComments: placeholder("allowComments"),

         createdAt: placeholder("createdAt"),
         updatedAt: placeholder("updatedAt")
      };
   }
}
