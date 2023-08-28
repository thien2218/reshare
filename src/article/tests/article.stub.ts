import {
   CreateArticleDto,
   SelectArticleDto,
   UpdateArticleDto
} from "src/schemas";

export const createArticleStub = (): CreateArticleDto => ({
   title: "Test Article",
   contentMdUrl: "https://example.com/test-article.md",
   wordCount: 1000,
   scope: "public",
   allowComments: true
});

export const selectArticleStub = (): SelectArticleDto => ({
   article: {
      id: "1",
      title: "Test Article",
      contentMdUrl: "https://example.com/test-article.md",
      wordCount: 1000,
      averageRating: 3
   },
   details: {
      scope: "public",
      allowComments: true,
      likesCount: 10,
      dislikesCount: 10,
      commentsCount: 10,
      createdAt: "2021-01-01T00:00:00Z",
      updatedAt: "2021-01-01T00:00:00Z"
   },
   author: {
      id: "userId",
      username: "testuser",
      email: "test@gmail.com",
      firstName: "Test",
      lastName: "User",
      photoUrl: null,
      emailVerified: true
   }
});

export const selectArticleAllStub = (): SelectArticleDto => ({
   article: {
      id: "1",
      title: "Test Article",
      contentMdUrl: "https://example.com/test-article.md",
      wordCount: 1000,
      averageRating: 3
   },
   details: {
      scope: "public",
      allowComments: true,
      likesCount: 10,
      dislikesCount: 10,
      commentsCount: 10,
      createdAt: "2021-01-01T00:00:00Z",
      updatedAt: "2021-01-01T00:00:00Z"
   },
   author: {
      id: "userId",
      username: "testuser",
      email: "test@gmail.com",
      firstName: "Test",
      lastName: "User",
      photoUrl: null,
      emailVerified: true
   }
});

export const updateArticleStub = (): UpdateArticleDto => ({
   title: "Test Article",
   contentMdUrl: "https://example.com/test-article.md",
   wordCount: 1000
});
