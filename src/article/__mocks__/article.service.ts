import { selectArticleStub } from "../tests/article.stub";

export const ArticleService = jest.fn().mockReturnValue({
   findOneById: jest.fn().mockResolvedValue(selectArticleStub()),
   create: jest.fn().mockResolvedValue(selectArticleStub()),
   update: jest.fn().mockResolvedValue(selectArticleStub()),
   remove: jest.fn().mockResolvedValue("Article successfully deleted")
});
