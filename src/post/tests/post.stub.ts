import { CreatePostDto, SelectPostDto } from "src/schemas";

export const createPostStub = (): CreatePostDto => ({
   content: "content",
   imgAttachments: ["img1", "img2"],
   urlAttachments: ["url1", "url2"],
   scope: "public",
   allowComments: true
});

export const selectPostStub = (): SelectPostDto => ({
   post: {
      id: "id",
      content: "content",
      imgAttachments: ["img1", "img2"],
      urlAttachments: ["url1", "url2"]
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

export const selectPostAllStub = () => ({
   post: {
      id: "id",
      content: "content",
      imgAttachments: ["img1", "img2"],
      urlAttachments: ["url1", "url2"]
   },
   details: {
      id: "resourceId",
      postId: "id",
      articleId: null,
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
      emailVerified: true,
      bio: "bio",
      createdAt: "2021-01-01T00:00:00Z",
      updatedAt: "2021-01-01T00:00:00Z"
   }
});

export const updatePostStub = () => ({
   content: "content",
   imgAttachments: ["img1", "img2"],
   urlAttachments: ["url1", "url2"]
});
