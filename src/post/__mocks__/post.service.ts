import { selectPostStub } from "../tests/post.stub";

export const PostService = jest.fn().mockReturnValue({
   create: jest.fn().mockReturnValue(selectPostStub()),
   findOneById: jest.fn().mockReturnValue(selectPostStub()),
   update: jest.fn().mockReturnValue(selectPostStub()),
   remove: jest.fn()
});
