import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
   async findOneById(id: string) {
      return `This action returns a #${id} user`;
   }

   async update(id: string, updateUserDto: UpdateUserDto) {
      return `This action updates a #${id} user`;
   }

   async remove(id: string) {
      return `This action removes a #${id} user`;
   }
}
