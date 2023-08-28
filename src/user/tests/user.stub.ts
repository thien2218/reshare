import { SelectUserDto, UpdateUserDto, UserDto } from "src/schemas/user.schema";

export const selectUserStub = (): SelectUserDto => ({
   id: "01H7CDCCSA7V0KBDGTTZE5MSHG",
   firstName: "Carmen",
   lastName: "Calvie",
   email: "ccalvie0@amazon.co.jp",
   username: "ccalvie0",
   photoUrl: "http://dummyimage.com/216x100.png/ff4444/ffffff",
   bio: "Triple-buffered demand-driven collaboration",
   emailVerified: true,
   createdAt: "2021-01-01T00:00:00.000Z",
   updatedAt: "2021-01-01T00:00:00.000Z"
});

export const updateUserStub = (): UpdateUserDto => ({
   firstName: "Lyndsie",
   email: "lchoulerton0@ucla.edu",
   username: "lchoulerton0"
});

export const userJwtStub = (): UserDto => ({
   sub: "01H7CDCCSA7V0KBDGTTZE5MSHG",
   username: "ccalvie0",
   firstName: "Carmen",
   lastName: "Calvie",
   email: "test@gmail.com",
   emailVerified: true,
   photoUrl: "http://dummyimage.com/216x100.png/ff4444/ffffff"
});
