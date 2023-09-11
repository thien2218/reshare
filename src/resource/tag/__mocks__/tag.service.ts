export const TagService = jest.fn().mockReturnValue({
   addTags: jest.fn().mockResolvedValue([]),
   removeTags: jest.fn().mockResolvedValue([])
});
