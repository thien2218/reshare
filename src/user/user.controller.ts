import {
   Controller,
   Get,
   Body,
   Patch,
   Param,
   Delete,
   ParseIntPipe,
   Query,
   DefaultValuePipe,
   UsePipes,
   Post
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
   CreateUserDto,
   CreateUserSchema,
   UpdateUserDto,
   UpdateUserSchema
} from "src/database/schemas/user.schema";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";

@Controller("user")
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get()
   async findMany(
      @Query("page", ParseIntPipe) page: number,
      @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number
   ) {
      return this.userService.findMany(page, limit);
   }

   @Get(":id")
   async findOneById(@Param("id") id: string) {
      return this.userService.findOneById(id);
   }

   @Patch(":id")
   @UsePipes(new ZodValidationPipe(UpdateUserSchema))
   async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(id, updateUserDto);
   }

   @Delete(":id")
   async remove(@Param("id") id: string) {
      return this.userService.remove(id);
   }
}
