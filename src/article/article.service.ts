import { Injectable } from "@nestjs/common";
import { selectArticleStub } from "./tests/article.stub";
import {
   CreateArticleDto,
   SelectArticleDto,
   UpdateArticleDto
} from "src/schemas/article.schema";

@Injectable()
export class ArticleService {
   async findOneById(id: string): Promise<SelectArticleDto> {
      return selectArticleStub();
   }

   async create(createArticleDto: CreateArticleDto): Promise<SelectArticleDto> {
      return selectArticleStub();
   }

   async update(
      id: string,
      updateArticleDto: UpdateArticleDto
   ): Promise<SelectArticleDto> {
      return selectArticleStub();
   }

   async remove(id: string): Promise<string> {
      return "Article successfully deleted";
   }
}
