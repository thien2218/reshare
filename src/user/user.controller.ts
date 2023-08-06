import {
   Controller,
   Get,
   Body,
   Put,
   Param,
   Delete,
   Query,
   DefaultValuePipe,
   UsePipes
} from "@nestjs/common";
import {
   UpdateUserDto,
   UpdateUserSchema
} from "src/database/schemas/user.schema";
import { UserService } from "./user.service";
import { PositiveIntPipe } from "src/pipes/positive-int.pipe";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";

@Controller("user")
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get()
   async findMany(
      @Query("page", PositiveIntPipe) page: number,
      @Query("limit", new DefaultValuePipe(20), PositiveIntPipe) limit: number
   ) {
      return this.userService.findMany(page, limit);
   }

   @Get(":id")
   async findOneById(@Param("id") id: string) {
      return this.userService.findOneById(id);
   }

   @Put(":id")
   @UsePipes(new ZodValidationPipe(UpdateUserSchema))
   async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(id, updateUserDto);
   }

   @Delete(":id")
   async remove(@Param("id") id: string) {
      return this.userService.remove(id);
   }
}
