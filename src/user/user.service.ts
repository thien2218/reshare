import {
   BadRequestException,
   Inject,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import {
   SelectUserDto,
   SelectUserSchema,
   UpdateUserDto
} from "src/schemas/user.schema";
import { DB_CONNECTION } from "../constants";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, placeholder } from "drizzle-orm";
import * as schema from "../schemas";

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
      const prepared = this.dbService
         .update(schema.users)
         .set(updateUserDto)
         .where(eq(schema.users.id, placeholder("id")))
         .returning()
         .prepare();
      const user = await prepared.get({ id });

      const result = SelectUserSchema.safeParse(user);

      if (!result.success) {
         throw new BadRequestException("Invalid user id");
      }

      return result.data;
   }

   async remove(id: string): Promise<string> {
      const user = await this.dbService
         .delete(schema.users)
         .where(eq(schema.users.id, placeholder("id")))
         .returning({ deletedId: schema.users.id })
         .get({ id });

      if (!user) {
         throw new BadRequestException("Invalid user id");
      }

      return "User deleted successfully!";
   }
}
