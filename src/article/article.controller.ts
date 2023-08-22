import {
   Body,
   Controller,
   Delete,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   Post,
   Put
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto, UpdateArticleDto } from "src/schemas/article.schema";

@Controller("article")
export class ArticleController {
   constructor(private readonly articleService: ArticleService) {}

   @Get(":id")
   async findOneById(@Param("id") id: string) {
      return this.articleService.findOneById(id);
   }

   @HttpCode(HttpStatus.CREATED)
   @Post()
   async create(@Body() createArticleDto: CreateArticleDto) {
      return this.articleService.create(createArticleDto);
   }

   @Put(":id")
   async update(
      @Param("id") id: string,
      @Body() updateArticleDto: UpdateArticleDto
   ) {
      return this.articleService.update(id, updateArticleDto);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   async remove(@Param("id") id: string) {
      return this.articleService.remove(id);
   }
}
