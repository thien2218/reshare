import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import {
   CreatePostDto,
   SelectPostDto,
   UpdatePostDto
} from "src/schemas/post.schema";

@Injectable()
export class PostService {
   constructor(private readonly dbService: DatabaseService) {}

   async create(
      userId: string,
      createPostDto: CreatePostDto
   ): Promise<SelectPostDto> {}

   async findOneById(id: string, userId: string): Promise<SelectPostDto> {}

   async update(
      id: string,
      userId: string,
      updatePostDto: UpdatePostDto
   ): Promise<SelectPostDto> {}

   async remove(id: string, userId: string) {}
}
