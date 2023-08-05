import { Inject, Injectable } from "@nestjs/common";
import {
   SelectUserDto,
   SelectUserSchema,
   UpdateUserDto,
   users
} from "src/database/schemas/user.schema";
import { userStub } from "./tests/stubs/user.stub";
import { DB_CONNECTION } from "../constants";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../database/schemas";

@Injectable()
export class UserService {
   constructor(
      @Inject(DB_CONNECTION)
      private readonly dbService: LibSQLDatabase<typeof schema>
   ) {}

   async findMany(page: number, limit: number): Promise<SelectUserDto[]> {
      const offset = (page - 1) * limit;
      const usersData = await this.dbService.query.users.findMany({
         limit,
         offset
      });

      const result = usersData.map((user) => SelectUserSchema.parse(user));
      return result;
   }

   async findOneById(id: string): Promise<SelectUserDto> {
      const userData = await this.dbService.query.users.findFirst({
         where: eq(users.id, id)
      });

      const result = SelectUserSchema.parse(userData);
      return result;
   }

   async update(
      id: string,
      updateUserDto: UpdateUserDto
   ): Promise<SelectUserDto> {
      return userStub();
   }

   async remove(id: string): Promise<string> {
      return "User deleted successfully!";
   }
}
