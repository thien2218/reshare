import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Param,
   Put,
   UsePipes
} from "@nestjs/common";
import { ResourceService } from "./resource.service";
import { AccessGuard } from "src/guards/access.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import {
   UpdateReactionSchema,
   UpdateResourceDto,
   UpdateResourceSchema
} from "src/schemas/resource.schema";
import { User } from "src/decorators/user.decorator";
import { UserDto } from "src/schemas";

@Controller("resource")
@UsePipes(AccessGuard)
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
      @Param("type", new ZodValidationPipe(UpdateReactionSchema)) type: string
   ) {
      return this.resourceService.react(id, sub, type);
   }
}
