import { selectArticleStub } from "src/article/tests/article.stub";
import { selectUserStub, selectUserStubs } from "../../user/tests/user.stub";

const mockQuery = {
   findMany: jest.fn().mockReturnThis(),
   findFirst: jest.fn().mockReturnThis(),
   prepare: jest.fn().mockReturnThis()
};

export const MockDbConnection = {
   query: {
      users: {
         ...mockQuery,
         get: jest.fn().mockResolvedValue(selectUserStub()),
         all: jest.fn().mockResolvedValue(selectUserStubs())
      },
      articles: {
         ...mockQuery,
         get: jest.fn().mockResolvedValue(selectArticleStub()),
         all: jest.fn().mockResolvedValue([selectArticleStub()])
      }
   },
   update: jest.fn().mockReturnThis(),
   set: jest.fn().mockReturnThis(),
   delete: jest.fn().mockReturnThis(),

   where: jest.fn().mockReturnThis(),
   returning: jest.fn().mockReturnThis(),
   prepare: jest.fn().mockReturnThis(),

   get: jest.fn().mockResolvedValue(selectUserStub()),
   all: jest.fn().mockResolvedValue(selectUserStubs())
};
