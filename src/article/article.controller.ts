import {
   Body,
   Controller,
   Delete,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   Post,
   Put,
   UseGuards,
   UsePipes
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import {
   CreateArticleDto,
   CreateArticleSchema,
   SelectArticleDto,
   UpdateArticleDto,
   UpdateArticleSchema,
   UserDto
} from "src/schemas";
import { AccessGuard } from "src/guards/access.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { User } from "src/decorators/user.decorator";

@Controller("article")
export class ArticleController {
   constructor(private readonly articleService: ArticleService) {}

   @HttpCode(HttpStatus.CREATED)
   @UseGuards(AccessGuard)
   @UsePipes(new ZodValidationPipe(CreateArticleSchema))
   @Post()
   async create(
      @User() user: UserDto,
      @Body() createArticleDto: CreateArticleDto
   ): Promise<SelectArticleDto> {
      return this.articleService.create(user, createArticleDto);
   }

   @Get(":id")
   async findOneById(@Param("id") id: string): Promise<SelectArticleDto> {
      return this.articleService.findOneById(id);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @UseGuards(AccessGuard)
   @UsePipes(new ZodValidationPipe(UpdateArticleSchema))
   @Put(":id")
   async update(
      @Param("id") id: string,
      @User() { sub }: UserDto,
      @Body() updateArticleDto: UpdateArticleDto
   ) {
      return this.articleService.update(id, sub, updateArticleDto);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @UseGuards(AccessGuard)
   @Delete(":id")
   async remove(@Param("id") id: string, @User() { sub }: UserDto) {
      return this.articleService.remove(id, sub);
   }
}
