export const MockJwtService = jest.fn().mockReturnValue({
   signAsync: jest.fn().mockImplementation(() => {
      return "token";
   })
});
