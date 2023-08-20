import { tokensStub } from "../tests/auth.stub";

export const AuthService = jest.fn().mockReturnValue({
   signup: jest.fn().mockResolvedValue(tokensStub()),
   signin: jest.fn().mockResolvedValue(tokensStub()),
   signout: jest.fn().mockResolvedValue("Signed out"),
   refresh: jest.fn().mockResolvedValue(tokensStub())
});
