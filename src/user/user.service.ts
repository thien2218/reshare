import { Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SelectUserType } from "src/database/schemas/user.schema";

@Injectable()
export class UserService {
   async findMany(
      page: number,
      itemsCount: number
   ): Promise<SelectUserType[]> {}

   async findOneById(id: string): Promise<SelectUserType> {}

   async update(
      id: string,
      updateUserDto: UpdateUserDto
   ): Promise<SelectUserType> {}

   async remove(id: string): Promise<string> {}
}
