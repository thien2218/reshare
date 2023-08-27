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
import { PostService } from "./post.service";
import { User } from "src/decorators/user.decorator";
import {
   CreatePostDto,
   CreatePostSchema,
   UpdatePostDto,
   UpdatePostSchema,
   UserDto
} from "src/schemas";
import { AccessGuard } from "src/guards/access.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";

@Controller("post")
export class PostController {
   constructor(private readonly postService: PostService) {}

   @UseGuards(AccessGuard)
   @HttpCode(HttpStatus.CREATED)
   @UsePipes(new ZodValidationPipe(CreatePostSchema))
   @Post()
   async create(@User() user: UserDto, @Body() createPostDto: CreatePostDto) {
      return this.postService.create(user, createPostDto);
   }

   @Get(":id")
   async findOneById(@Param("id") id: string) {
      return this.postService.findOneById(id);
   }

   @UseGuards(AccessGuard)
   @UsePipes(new ZodValidationPipe(UpdatePostSchema))
   @Put(":id")
   async update(
      @Param("id") id: string,
      @User() { sub }: UserDto,
      @Body() updatePostDto: UpdatePostDto
   ) {
      return this.postService.update(id, sub, updatePostDto);
   }

   @UseGuards(AccessGuard)
   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   async remove(@Param("id") id: string, @User() { sub }: UserDto) {
      return this.postService.remove(id, sub);
   }
}
