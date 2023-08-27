import {
   CreateArticleDto,
   SelectArticleDto,
   UpdateArticleDto
} from "src/database/tables/articles";

export const selectArticleStub = (): SelectArticleDto => ({
   id: "1",
   authorId: "1",
   title: "Test Article",
   contentMdUrl: "https://example.com/test-article.md",
   wordCount: 1000,
   scope: "public",
   allowComments: true,
   likesCount: 10,
   dislikesCount: 10,
   commentsCount: 10,
   averageRating: 3,
   createdAt: "2021-01-01T00:00:00Z",
   updatedAt: "2021-01-01T00:00:00Z"
});

export const createArticleStub = (): CreateArticleDto => ({
   title: "Test Article",
   contentMdUrl: "https://example.com/test-article.md",
   wordCount: 1000,
   scope: "public",
   allowComments: true
});

export const updateArticleStub = (): UpdateArticleDto => ({
   title: "Test Article",
   contentMdUrl: "https://example.com/test-article.md",
   wordCount: 1000
});
