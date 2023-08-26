import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import {
   CreateArticleDto,
   SelectArticleDto,
   SelectArticleSchema,
   UpdateArticleDto
} from "src/schemas/validation";
import { articles } from "src/schemas/tables";
import { and, eq, placeholder } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getTimestamp } from "src/utils/getTimestamp";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class ArticleService {
   constructor(private readonly dbService: DatabaseService) {}

   async findOneById(id: string): Promise<SelectArticleDto> {
      const prepared = this.dbService.db.query.articles
         .findFirst({
            where: and(eq(articles.id, placeholder("id")))
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
         .insert(articles)
         .values(this.articlePlaceholders())
         .returning()
         .prepare();
      const article = await prepared.get(values);

      if (!article) throw new BadRequestException("Invalid user id");

      const result = SelectArticleSchema.parse(values);
      return result;
   }

   async update(
      id: string,
      userId: string,
      updateArticleDto: UpdateArticleDto
   ): Promise<SelectArticleDto> {
      const prepared = await this.dbService.db
         .update(articles)
         .set(updateArticleDto)
         .where(
            and(
               eq(articles.id, placeholder("id")),
               eq(articles.authorId, placeholder("userId"))
            )
         )
         .returning()
         .prepare();
      const article = await prepared.get({ id, userId });

      if (!article)
         throw new BadRequestException("Invalid article id or user id");

      const result = SelectArticleSchema.parse(article);
      return result;
   }

   async remove(id: string, userId: string) {
      const isDeleted = await this.dbService.db
         .delete(articles)
         .where(and(eq(articles.id, id), eq(articles.authorId, userId)))
         .returning({})
         .get();

      if (!isDeleted) throw new BadRequestException("Article not found");
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
