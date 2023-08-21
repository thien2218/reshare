import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { CreateUserDto, SigninUserDto } from "src/schemas/user.schema";
import {
   createUserStub,
   refreshPayloadSetNewStub,
   refreshPayloadStub,
   signInUserStub,
   tokensStub
} from "./auth.stub";
import { AuthService } from "../auth.service";
import { UserRefresh } from "src/decorators/user.decorator";

jest.mock("../auth.service");

describe("AuthController", () => {
   let controller: AuthController;
   let service: AuthService;

   const tokens = tokensStub();
   const res = {
      setCookie: jest.fn(),
      send: jest.fn(),
      clearCookie: jest.fn()
   } as any;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [AuthController],
         providers: [AuthService]
      }).compile();

      controller = module.get<AuthController>(AuthController);
      service = module.get<AuthService>(AuthService);
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(controller).toBeDefined();
   });

   describe("signup", () => {
      let createUserDto: CreateUserDto;

      beforeEach(async () => {
         createUserDto = createUserStub();
         await controller.signup(createUserDto, res);
      });

      it("should be defined", () => {
         expect(controller.signup).toBeDefined();
      });

      it("should be called with correct params", () => {
         expect(service.signup).toBeCalledWith(createUserDto);
      });

      it("should set cookie with correct params", () => {
         expect(res.setCookie).toBeCalledWith(
            "reshare-refresh-token",
            tokens.refreshToken,
            {
               httpOnly: true,
               maxAge: 60 * 60 * 24 * 15,
               sameSite: "lax"
            }
         );
      });

      it("should send res with correct data", () => {
         expect(res.send).toBeCalledWith(tokens);
      });
   });

   describe("signin", () => {
      let signinUserDto: SigninUserDto;

      beforeEach(async () => {
         signinUserDto = signInUserStub();
         await controller.signin(signinUserDto, res);
      });

      it("should be defined", () => {
         expect(controller.signin).toBeDefined();
      });

      it("should be called with correct params", () => {
         expect(service.signin).toBeCalledWith(signinUserDto);
      });

      it("should call setCookie method of res with correct params", () => {
         expect(res.setCookie).toBeCalledWith(
            "reshare-refresh-token",
            tokens.refreshToken,
            {
               httpOnly: true,
               maxAge: 60 * 60 * 24 * 15,
               sameSite: "lax"
            }
         );
      });

      it("should call send method of res with correct params", () => {
         expect(res.send).toBeCalledWith(tokens);
      });
   });

   describe("signout", () => {
      let rfPayload: UserRefresh;

      beforeEach(async () => {
         rfPayload = refreshPayloadStub();
         await controller.signout(rfPayload, res);
      });

      it("should be defined", () => {
         expect(controller.signout).toBeDefined();
      });

      it("should call clearCookie method of res with correct params", () => {
         expect(res.clearCookie).toBeCalledWith("reshare-refresh-token");
      });

      it("should be called with correct params", () => {
         expect(service.signout).toBeCalledWith(rfPayload);
      });

      it("should call send method of res with correct params", () => {
         expect(res.send).toBeCalledWith({
            message: "Signed out"
         });
      });
   });

   describe("refresh", () => {
      let rfPayload: UserRefresh;

      beforeEach(async () => {
         rfPayload = refreshPayloadSetNewStub();
         await controller.refresh(rfPayload, res);
      });

      it("should be defined", () => {
         expect(controller.refresh).toBeDefined();
      });

      it("should be called with correct params", () => {
         expect(service.refresh).toBeCalledWith(rfPayload, true);
      });

      it("should call setCookie method of res with correct params", () => {
         expect(res.setCookie).toBeCalledWith(
            "reshare-refresh-token",
            tokens.refreshToken,
            {
               httpOnly: true,
               maxAge: 60 * 60 * 24 * 15,
               sameSite: "lax"
            }
         );
      });

      it("should call send method of res with correct params", () => {
         expect(res.send).toBeCalledWith(tokens);
      });

      it("should return access token if refresh token is still fresh", async () => {
         rfPayload = refreshPayloadStub();
         await controller.refresh(rfPayload, res);
         expect(service.refresh).toBeCalledWith(rfPayload, false);
      });

      it("should send back the access token if refresh token is still fresh", async () => {
         rfPayload = refreshPayloadStub();
         await controller.refresh(rfPayload, res);
         expect(res.send).toBeCalledWith({ accessToken: tokens.accessToken });
      });
   });
});
