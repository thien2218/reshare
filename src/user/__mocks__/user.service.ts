import { selectUserStub, selectUserStubs } from "../tests/user.stub";

export const UserService = jest.fn().mockReturnValue({
   findMany: jest.fn().mockResolvedValue(selectUserStubs()),
   findOneById: jest.fn().mockResolvedValue(selectUserStub()),
   update: jest.fn().mockResolvedValue(selectUserStub()),
   remove: jest.fn().mockResolvedValue("User deleted successfully!")
});
