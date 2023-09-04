import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Param,
   ParseEnumPipe,
   Put,
   UseGuards,
   UsePipes
} from "@nestjs/common";
import { ResourceService } from "./resource.service";
import { AccessGuard } from "src/guards/access.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import {
   UpdateResourceDto,
   UpdateResourceSchema
} from "src/schemas/resource.schema";
import { User } from "src/decorators/user.decorator";
import { UserDto } from "src/schemas";

@Controller("resource")
@UseGuards(AccessGuard)
export class ResourceController {
   constructor(private readonly resourceService: ResourceService) {}

   @HttpCode(HttpStatus.NO_CONTENT)
   @UsePipes(new ZodValidationPipe(UpdateResourceSchema))
   @Put(":id")
   async update(
      @Param("id") id: string,
      @User() { sub }: UserDto,
      @Body() updateResourceDto: UpdateResourceDto
   ) {
      return this.resourceService.update(id, sub, updateResourceDto);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Put(":id/react/:type")
   async react(
      @Param("id") id: string,
      @User() { sub }: UserDto,
      @Param("type", new ParseEnumPipe(["like", "dislike"]))
      type: "like" | "dislike"
   ) {
      return this.resourceService.react(id, sub, type);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Put(":id/unreact/:type")
   async unreact(
      @Param("id") id: string,
      @User() { sub }: UserDto,
      @Param("type", new ParseEnumPipe(["like", "dislike"]))
      type: "like" | "dislike"
   ) {
      return this.resourceService.unreact(id, sub, type);
   }
}
