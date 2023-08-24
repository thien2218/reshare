import { User } from "src/decorators/user.decorator";
import { SelectUserDto, UpdateUserDto } from "src/schemas/user.schema";

export const selectUserStub = (): SelectUserDto => {
   return {
      id: "01H7CDCCSA7V0KBDGTTZE5MSHG",
      firstName: "Carmen",
      lastName: "Calvie",
      email: "ccalvie0@amazon.co.jp",
      username: "ccalvie0",
      photoUrl: "http://dummyimage.com/216x100.png/ff4444/ffffff",
      bio: "Triple-buffered demand-driven collaboration",
      emailVerified: true
   };
};

export const updateUserStub = (): UpdateUserDto => {
   return {
      firstName: "Lyndsie",
      email: "lchoulerton0@ucla.edu",
      username: "lchoulerton0"
   };
};

export const userJwtStub = (): User => {
   return {
      sub: "01H7CDCCSA7V0KBDGTTZE5MSHG",
      username: "ccalvie0",
      first_name: "Carmen",
      last_name: "Calvie",
      email: "test@gmail.com",
      email_verified: true
   };
};
