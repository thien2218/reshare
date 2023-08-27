import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import { and, eq, inArray, placeholder } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";
import {
   CreatePostDto,
   SelectPostDto,
   SelectPostSchema,
   UpdatePostDto,
   UserDto
} from "src/schemas";
import { posts, resources, users } from "src/database/tables";
import { nanoid } from "nanoid";
import { getTimestamp } from "src/utils/getTimestamp";
import { alias } from "drizzle-orm/sqlite-core";

@Injectable()
export class PostService {
   constructor(private readonly dbService: DatabaseService) {}

   async create(
      { sub, ...userRest }: UserDto,
      { scope, allowComments, ...postRest }: CreatePostDto
   ): Promise<SelectPostDto> {
      const postValues = {
         id: nanoid(25),
         ...postRest
      };

      const resourceValues = {
         id: nanoid(25),
         authorId: sub,
         scope,
         allowComments,
         createdAt: getTimestamp(),
         updatedAt: getTimestamp()
      };

      const postInfo = this.dbService.db.transaction(async (txn) => {
         const postPrepare = txn
            .insert(posts)
            .values(this.postPlaceholders())
            .returning()
            .prepare();

         const post = await postPrepare.get(postValues);
         if (!post) throw new BadRequestException("Invalid user id");

         const resourcePrepare = txn
            .insert(resources)
            .values(this.resourcePlaceholders())
            .returning()
            .prepare();

         const details = await resourcePrepare.get(resourceValues);
         if (!details) throw new BadRequestException("Invalid user id");

         return { post, details, author: { id: sub, ...userRest } };
      });

      const result = SelectPostSchema.parse(postInfo);
      return result;
   }

   async findOneById(id: string): Promise<SelectPostDto> {
      const details = alias(resources, "details");
      const author = alias(users, "author");

      const prepared = this.dbService.db
         .select()
         .from(posts)
         .where(eq(posts.id, placeholder("id")))
         .innerJoin(details, eq(posts.id, details.articleId))
         .innerJoin(author, eq(details.authorId, author.id))
         .limit(1)
         .prepare();

      const post = await prepared.get({ id });
      if (!post) throw new NotFoundException();

      const result = SelectPostSchema.parse(post);
      return result;
   }

   async update(
      id: string,
      userId: string,
      updatePostDto: UpdatePostDto
   ): Promise<SelectPostDto> {
      const subquery = this.dbService.db
         .select()
         .from(resources)
         .where(
            and(
               eq(resources.postId, placeholder("id")),
               eq(resources.authorId, placeholder("userId"))
            )
         );

      const prepared = this.dbService.db
         .update(posts)
         .set(updatePostDto)
         .where(
            and(eq(posts.id, placeholder("id")), inArray(posts.id, subquery))
         )
         .returning()
         .prepare();
      const post = await prepared.get({ id, userId });

      if (!post) throw new BadRequestException("Invalid post id or user id");

      const result = SelectPostSchema.parse(post);
      return result;
   }

   async remove(id: string, userId: string) {
      const subquery = this.dbService.db
         .select()
         .from(resources)
         .where(and(eq(resources.postId, id), eq(resources.authorId, userId)));

      const isDeleted = await this.dbService.db
         .delete(posts)
         .where(
            and(eq(posts.id, placeholder("id")), inArray(posts.id, subquery))
         )
         .returning({})
         .get();

      if (!isDeleted)
         throw new BadRequestException("Post not found in database");
   }

   // PRIVATE

   private postPlaceholders() {
      return {
         id: placeholder("id"),
         content: placeholder("content"),
         imgAttachments: placeholder("imgAttachments"),
         urlAttachments: placeholder("urlAttachments")
      };
   }

   private resourcePlaceholders() {
      return {
         id: placeholder("id"),
         authorId: placeholder("authorId"),
         scope: placeholder("scope"),
         allowComments: placeholder("allowComments"),
         createdAt: placeholder("createdAt"),
         updatedAt: placeholder("updatedAt")
      };
   }
}
