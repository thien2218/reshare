import { userStub, userStubs } from "../../user/tests/user.stub";

export const MockDbConnection = {
   query: {
      users: {
         findMany: jest.fn().mockReturnThis(),
         findFirst: jest.fn().mockReturnThis(),
         prepare: jest.fn().mockReturnThis(),

         get: jest.fn().mockResolvedValue(userStub()),
         all: jest.fn().mockResolvedValue(userStubs())
      }
   },
   update: jest.fn().mockReturnThis(),
   set: jest.fn().mockReturnThis(),
   delete: jest.fn().mockReturnThis(),

   where: jest.fn().mockReturnThis(),
   returning: jest.fn().mockReturnThis(),
   prepare: jest.fn().mockReturnThis(),

   get: jest.fn().mockResolvedValue(userStub()),
   all: jest.fn().mockResolvedValue(userStubs())
};
