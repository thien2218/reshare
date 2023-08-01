import {
   Controller,
   Get,
   Body,
   Patch,
   Param,
   Delete,
   ParseIntPipe,
   Query,
   DefaultValuePipe
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get()
   async findMany(
      @Query("page", ParseIntPipe) page: number,
      @Query("items_count", new DefaultValuePipe(20), ParseIntPipe)
      itemsCount: number
   ) {
      return this.userService.findMany(page, itemsCount);
   }

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
