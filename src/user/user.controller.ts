import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get(":id")
   async findOneById(@Param("id") id: string) {
      return this.userService.findOneById(id);
   }

   @Patch(":id")
   async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(id, updateUserDto);
   }

   @Delete(":id")
   async remove(@Param("id") id: string) {
      return this.userService.remove(id);
   }
}
