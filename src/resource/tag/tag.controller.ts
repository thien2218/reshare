import {
   Body,
   Controller,
   Delete,
   HttpCode,
   HttpStatus,
   Param,
   Post,
   UseGuards,
   UsePipes
} from "@nestjs/common";
import { TagService } from "./tag.service";
import { AccessGuard } from "src/guards/access.guard";
import { User } from "src/decorators/user.decorator";
import { UserDto } from "src/schemas";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { array, string } from "zod";

@UseGuards(AccessGuard)
@Controller("resource/:resId/tags")
export class TagController {
   constructor(private readonly tagService: TagService) {}

   @HttpCode(HttpStatus.CREATED)
   @UsePipes(new ZodValidationPipe(array(string()).nonempty()))
   @Post()
   async addTags(
      @Param("resId") resId: string,
      @User() { sub }: UserDto,
      @Body() tags: string[]
   ) {
      return this.tagService.addTags(resId, sub, tags);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @UsePipes(new ZodValidationPipe(array(string()).nonempty()))
   @Delete()
   async removeTags(
      @Param("resId") resId: string,
      @User() { sub }: UserDto,
      @Body() tags: string[]
   ) {
      return this.tagService.removeTags(resId, sub, tags);
   }
}
