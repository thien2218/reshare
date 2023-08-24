import { Injectable, NotFoundException } from "@nestjs/common";
import { selectArticleStub } from "./tests/article.stub";
import {
   CreateArticleDto,
   SelectArticleDto,
   SelectArticleSchema,
   UpdateArticleDto
} from "src/schemas/article.schema";
import * as schema from "../schemas";
import { eq, placeholder } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getTimestamp } from "src/utils/getTimestamp";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class ArticleService {
   constructor(private readonly dbService: DatabaseService) {}

   async findOneById(id: string): Promise<SelectArticleDto> {
      const prepared = this.dbService.db.query.articles
         .findFirst({
            where: eq(schema.articles.id, placeholder("id"))
         })
         .prepare();

      const article = await prepared.get({ id });
      if (!article) throw new NotFoundException("Article not found");

      const result = SelectArticleSchema.parse(article);
      return result;
   }

   async create(
      userId: string,
      createArticleDto: CreateArticleDto
   ): Promise<SelectArticleDto> {
      const values = {
         id: nanoid(25),
         ...createArticleDto,
         authorId: userId,
         createdAt: getTimestamp(),
         updatedAt: getTimestamp()
      };

      const prepared = this.dbService.db
         .insert(schema.articles)
         .values(this.articlePlaceholders())
         .prepare();

      const article = await prepared
         .run(values)
         .catch(this.dbService.handleDbError);

      const result = SelectArticleSchema.parse(article);
      return result;
   }

   async update(
      id: string,
      userId: string,
      updateArticleDto: UpdateArticleDto
   ): Promise<SelectArticleDto> {
      return selectArticleStub();
   }

   async remove(id: string, userId: string): Promise<string> {
      return "Article successfully deleted";
   }

   // PRIVATE

   private articlePlaceholders() {
      return {
         id: placeholder("id"),
         authorId: placeholder("authorId"),
         title: placeholder("title"),
         contentMdUrl: placeholder("contentMdUrl"),
         wordCount: placeholder("wordCount"),

         scope: placeholder("scope"),
         allowComments: placeholder("allowComments"),

         createdAt: placeholder("createdAt"),
         updatedAt: placeholder("updatedAt")
      };
   }
}
