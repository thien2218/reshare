import { Injectable } from "@nestjs/common";
import { SelectUserDto, UpdateUserDto } from "src/database/schemas/user.schema";
import { userStub, userStubs } from "./tests/stubs/user.stub";

@Injectable()
export class UserService {
   async findMany(page: number, itemsCount: number): Promise<SelectUserDto[]> {
      return userStubs();
   }

   async findOneById(id: string): Promise<SelectUserDto> {
      return userStub();
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
