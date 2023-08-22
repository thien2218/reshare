import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { selectArticleStub } from "./tests/article.stub";
import {
   CreateArticleDto,
   SelectArticleDto,
   SelectArticleSchema,
   UpdateArticleDto
} from "src/schemas/article.schema";
import { DB_CONNECTION } from "src/constants";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "../schemas";
import { eq, placeholder } from "drizzle-orm";

@Injectable()
export class ArticleService {
   constructor(
      @Inject(DB_CONNECTION)
      private readonly dbService: LibSQLDatabase<typeof schema>
   ) {}

   async findOneById(id: string): Promise<SelectArticleDto> {
      const prepared = this.dbService.query.articles
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
      return selectArticleStub();
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
}
