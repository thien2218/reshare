import {
   Controller,
   Get,
   Body,
   Put,
   Param,
   Delete,
   UsePipes,
   HttpCode,
   HttpStatus
} from "@nestjs/common";
import { SelectUserDto, UpdateUserDto, UpdateUserSchema } from "src/schemas";
import { UserService } from "./user.service";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";

@Controller("user")
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get(":id")
   async findOneById(@Param("id") id: string): Promise<SelectUserDto> {
      return this.userService.findOneById(id);
   }

   @UsePipes(new ZodValidationPipe(UpdateUserSchema))
   @Put(":id")
   async update(
      @Param("id") id: string,
      @Body() updateUserDto: UpdateUserDto
   ): Promise<SelectUserDto> {
      return this.userService.update(id, updateUserDto);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   async remove(@Param("id") id: string) {
      return this.userService.remove(id);
   }
}
