import {
   Controller,
   Get,
   Body,
   Put,
   Param,
   Delete,
   UsePipes,
   UseInterceptors
} from "@nestjs/common";
import {
   SelectUserDto,
   UpdateUserDto,
   UpdateUserSchema
} from "src/database/schemas/user.schema";
import { UserService } from "./user.service";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { ParseIntQueryInterceptor } from "src/interceptors/query.interceptor";
import { TypedQuery } from "src/decorators/typed-query.decorator";
import { UserQuery, UserQuerySchema } from "src/schemas/query.schema";
import { ParseQueryPipe } from "src/pipes/query.pipe";

@Controller("user")
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get()
   @UseInterceptors(ParseIntQueryInterceptor)
   async findMany(
      @TypedQuery(new ParseQueryPipe(UserQuerySchema)) query: UserQuery
   ): Promise<SelectUserDto[]> {
      return this.userService.findMany(query.offset, query.limit);
   }

   @Get(":id")
   async findOneById(@Param("id") id: string): Promise<SelectUserDto> {
      return this.userService.findOneById(id);
   }

   @Put(":id")
   @UsePipes(new ZodValidationPipe(UpdateUserSchema))
   async update(
      @Param("id") id: string,
      @Body() updateUserDto: UpdateUserDto
   ): Promise<SelectUserDto> {
      return this.userService.update(id, updateUserDto);
   }

   @Delete(":id")
   async remove(@Param("id") id: string): Promise<string> {
      return this.userService.remove(id);
   }
}
