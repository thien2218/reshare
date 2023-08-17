import { tokensStub } from "../tests/auth.stub";

export const AuthService = {
   signup: jest.fn().mockResolvedValue(tokensStub()),
   signin: jest.fn().mockResolvedValue(tokensStub()),
   signout: jest.fn().mockResolvedValue("Signed out"),
   refresh: jest.fn().mockResolvedValue(tokensStub())
};
