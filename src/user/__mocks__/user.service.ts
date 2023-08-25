import { selectUserStub } from "../tests/user.stub";

export const UserService = jest.fn().mockReturnValue({
   findMany: jest.fn().mockResolvedValue([selectUserStub()]),
   findOneById: jest.fn().mockResolvedValue(selectUserStub()),
   update: jest.fn().mockResolvedValue(selectUserStub()),
   remove: jest.fn()
});
