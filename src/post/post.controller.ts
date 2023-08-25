import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put
} from "@nestjs/common";
import { PostService } from "./post.service";
import { User } from "src/decorators/user.decorator";
import { CreatePostDto, UpdatePostDto } from "src/schemas/post.schema";

@Controller("post")
export class PostController {
   constructor(private readonly postService: PostService) {}

   @Post()
   async create(@User() { sub }: User, @Body() createPostDto: CreatePostDto) {
      return this.postService.create(sub, createPostDto);
   }

   @Get(":id")
   async findOneById(@Param("id") id: string, @User() { sub }: User) {
      return this.postService.findOneById(id, sub);
   }

   @Put(":id")
   async update(
      @Param("id") id: string,
      @User() { sub }: User,
      @Body() updatePostDto: UpdatePostDto
   ) {
      return this.postService.update(id, sub, updatePostDto);
   }

   @Delete(":id")
   async remove(@Param("id") id: string, @User() { sub }: User) {
      return this.postService.remove(id, sub);
   }
}
