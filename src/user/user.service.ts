import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import {
   SelectUserDto,
   SelectUserSchema,
   UpdateUserDto
} from "src/schemas/user.schema";
import { eq, placeholder } from "drizzle-orm";
import * as schema from "../schemas";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class UserService {
   constructor(private readonly dbService: DatabaseService) {}

   async findOneById(id: string): Promise<SelectUserDto> {
      const prepared = this.dbService.db.query.users
         .findFirst({
            where: eq(schema.users.id, placeholder("id"))
         })
         .prepare();

      const user = await prepared.get({ id });
      if (!user) throw new NotFoundException();

      const result = SelectUserSchema.parse(user);
      return result;
   }

   async update(
      id: string,
      updateUserDto: UpdateUserDto
   ): Promise<SelectUserDto> {
      const user = await this.dbService.db
         .update(schema.users)
         .set(updateUserDto)
         .where(eq(schema.users.id, id))
         .returning()
         .get();

      if (!user) {
         throw new BadRequestException("Invalid user id");
      }

      const result = SelectUserSchema.parse(user);
      return result;
   }

   async remove(id: string) {
      const isDeleted = await this.dbService.db
         .delete(schema.users)
         .where(eq(schema.users.id, id))
         .returning({})
         .get();

      if (!isDeleted) {
         throw new BadRequestException("Invalid user id");
      }
   }
}
