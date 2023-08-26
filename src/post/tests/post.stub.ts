export const createPostStub = () => ({
   content: "content",
   imgAttachments: ["img1", "img2"],
   urlAttachments: ["url1", "url2"]
});

export const selectPostStub = () => ({
   id: "id",
   authorId: "authorId",
   content: "content",
   imgAttachments: ["img1", "img2"],
   urlAttachments: ["url1", "url2"],
   scope: "public",
   allowComments: true,
   likesCount: 0,
   dislikesCount: 0,
   commentsCount: 0,
   createdAt: "createdAt",
   updatedAt: "updatedAt"
});

export const updatePostStub = () => ({
   content: "content"
});