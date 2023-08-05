import { userStub, userStubs } from "../tests/stubs/user.stub";

export const mockDbService = {
   query: {
      users: {
         findMany: jest.fn().mockResolvedValue(userStubs()),
         findFirst: jest.fn().mockResolvedValue(userStub())
      }
   }
};
