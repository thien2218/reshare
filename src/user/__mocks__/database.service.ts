import { userStub, userStubs } from "../tests/stubs/user.stub";

export const mockDbService = {
   query: {
      users: {
         findMany: jest.fn().mockReturnThis(),
         findFirst: jest.fn().mockReturnThis(),
         prepare: jest.fn().mockReturnThis(),
         get: jest.fn().mockResolvedValue(userStub()),
         all: jest.fn().mockResolvedValue(userStubs())
      }
   }
};
