import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import {
   CreateArticleDto,
   SelectArticleDto,
   SelectArticleSchema,
   UpdateArticleDto,
   UserDto
} from "src/schemas";
import { articles, resources, users } from "src/database/tables";
import { and, eq, inArray, placeholder } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getTimestamp } from "src/utils/getTimestamp";
import { DatabaseService } from "src/database/database.service";
import { alias } from "drizzle-orm/sqlite-core";

@Injectable()
export class ArticleService {
   constructor(private readonly dbService: DatabaseService) {}

   async create(
      { sub, ...userRest }: UserDto,
      { scope, allowComments, ...articleRest }: CreateArticleDto
   ): Promise<SelectArticleDto> {
      const articleValues = {
         id: nanoid(25),
         ...articleRest
      };

      const resourceValues = {
         id: nanoid(25),
         authorId: sub,
         scope,
         allowComments,
         createdAt: getTimestamp(),
         updatedAt: getTimestamp()
      };

      const articleInfo = await this.dbService.db.transaction(async (txn) => {
         const articlePrepare = txn
            .insert(articles)
            .values(this.articlePlaceholders())
            .returning()
            .prepare();

         const article = await articlePrepare.get(articleValues);
         if (!article) throw new BadRequestException("Invalid user id");

         const resourcePrepare = txn
            .insert(resources)
            .values(this.resourcePlaceholders())
            .returning()
            .prepare();

         const details = await resourcePrepare.get(resourceValues);
         if (!details) throw new BadRequestException("Invalid user id");

         return { article, details, author: { id: sub, ...userRest } };
      });

      const result = SelectArticleSchema.parse(articleInfo);
      return result;
   }

   async findOneById(id: string): Promise<SelectArticleDto> {
      const details = alias(resources, "details");
      const author = alias(users, "author");

      const prepared = this.dbService.db
         .select()
         .from(articles)
         .where(eq(articles.id, placeholder("id")))
         .innerJoin(details, eq(articles.id, details.articleId))
         .innerJoin(author, eq(details.authorId, author.id))
         .prepare();

      const article = await prepared.get({ id });
      if (!article) throw new NotFoundException("Article not found");

      const result = SelectArticleSchema.parse(article);
      return result;
   }

   async update(
      id: string,
      userId: string,
      updateArticleDto: UpdateArticleDto
   ): Promise<SelectArticleDto> {
      const subquery = this.dbService.db
         .select({ articleId: resources.articleId })
         .from(resources)
         .where(
            and(
               eq(resources.articleId, placeholder("id")),
               eq(resources.authorId, placeholder("userId"))
            )
         );

      const prepared = this.dbService.db
         .update(articles)
         .set(updateArticleDto)
         .where(eq(articles.id, subquery))
         .returning()
         .prepare();

      const article = await prepared.get({ id, userId });
      if (!article)
         throw new BadRequestException("Invalid article id or user id");

      const result = SelectArticleSchema.parse(article);
      return result;
   }

   async remove(id: string, userId: string) {
      const subquery = this.dbService.db
         .select({ articleId: resources.articleId })
         .from(resources)
         .where(
            and(eq(resources.articleId, id), eq(resources.authorId, userId))
         );

      const isDeleted = await this.dbService.db
         .delete(articles)
         .where(eq(articles.id, subquery))
         .returning({})
         .get();

      if (!isDeleted) throw new BadRequestException("Article not found");
   }

   // PRIVATE

   private articlePlaceholders() {
      return {
         id: placeholder("id"),
         title: placeholder("title"),
         contentMdUrl: placeholder("contentMdUrl"),
         wordCount: placeholder("wordCount")
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
