import {
   Controller,
   Get,
   Body,
   Put,
   Param,
   Delete,
   UsePipes,
   UseInterceptors,
   HttpCode,
   HttpStatus
} from "@nestjs/common";
import {
   SelectUserDto,
   UpdateUserDto,
   UpdateUserSchema
} from "src/schemas/user.schema";
import { UserService } from "./user.service";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { ParseIntQueryInterceptor } from "src/interceptors/query.interceptor";
import { TypedQuery } from "src/decorators/typed-query.decorator";
import { UserQuery, UserQuerySchema } from "src/schemas/query.schema";
import { ParseQueryPipe } from "src/pipes/query.pipe";

@Controller("user")
export class UserController {
   constructor(private readonly userService: UserService) {}

   @UseInterceptors(ParseIntQueryInterceptor)
   @Get()
   async findMany(
      @TypedQuery(new ParseQueryPipe(UserQuerySchema)) query: UserQuery
   ): Promise<SelectUserDto[]> {
      return this.userService.findMany(query.offset, query.limit);
   }

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
