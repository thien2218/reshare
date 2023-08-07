import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
   SelectUserDto,
   SelectUserSchema,
   UpdateUserDto
} from "src/database/schemas/user.schema";
import { userStub } from "./tests/stubs/user.stub";
import { DB_CONNECTION } from "../constants";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, placeholder } from "drizzle-orm";
import * as schema from "../database/schemas";

@Injectable()
export class UserService {
   constructor(
      @Inject(DB_CONNECTION)
      private readonly dbService: LibSQLDatabase<typeof schema>
   ) {}

   async findMany(offset: number, limit: number): Promise<SelectUserDto[]> {
      const prepared = this.dbService.query.users
         .findMany({
            limit: placeholder("limit"),
            offset: placeholder("offset")
         })
         .prepare();

      const users = await prepared.all({ limit, offset });
      if (!users.length) throw new NotFoundException();

      const result = users.map((user) => SelectUserSchema.parse(user));
      return result;
   }

   async findOneById(id: string): Promise<SelectUserDto> {
      const prepared = this.dbService.query.users
         .findFirst({
            where: eq(schema.users.id, id)
         })
         .prepare();

      const user = await prepared.get();
      if (user === undefined) throw new NotFoundException();

      const result = SelectUserSchema.parse(user);
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
