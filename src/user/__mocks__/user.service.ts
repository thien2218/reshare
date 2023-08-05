import { userStub, userStubs } from "../tests/stubs/user.stub";

export const UserService = jest.fn().mockReturnValue({
   findMany: jest.fn().mockResolvedValue(userStubs()),
   findOneById: jest.fn().mockResolvedValue(userStub()),
   update: jest.fn().mockResolvedValue(userStub()),
   remove: jest.fn().mockResolvedValue("User deleted successfully!")
});
