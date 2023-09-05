import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import { SelectUserDto, SelectUserSchema, UpdateUserDto } from "src/schemas";
import { eq, placeholder } from "drizzle-orm";
import { users } from "src/database/tables";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class UserService {
   constructor(private readonly dbService: DatabaseService) {}

   async findOneById(id: string): Promise<SelectUserDto> {
      const prepared = this.dbService.db
         .select()
         .from(users)
         .where(eq(users.id, placeholder("id")))
         .prepare();

      const user = await prepared.get({ id });
      if (!user) throw new NotFoundException();

      const result = SelectUserSchema.parse(user);
      return result;
   }

   async update(id: string, updateUserDto: UpdateUserDto) {
      const { rowsAffected } = await this.dbService.db
         .update(users)
         .set(updateUserDto)
         .where(eq(users.id, id))
         .run();

      if (rowsAffected === 0) throw new BadRequestException("Invalid user id");
   }

   async remove(id: string) {
      const { rowsAffected } = await this.dbService.db
         .delete(users)
         .where(eq(users.id, id))
         .run();

      if (rowsAffected === 0) {
         throw new BadRequestException("Invalid user id");
      }
   }
}
