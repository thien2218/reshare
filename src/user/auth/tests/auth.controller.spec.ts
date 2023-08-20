import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { CreateUserDto, SigninUserDto } from "src/schemas/user.schema";
import {
   createUserStub,
   refreshPayloadSetNewStub,
   refreshPayloadStub,
   signInUserStub,
   tokensStub,
   userPayloadStub
} from "./auth.stub";
import { AuthService } from "../auth.service";
import { RefreshPayload, UserPayload } from "src/decorators/payload.decorator";

jest.mock("../auth.service");

describe("AuthController", () => {
   let controller: AuthController;
   let service: AuthService;

   const tokens = tokensStub();
   const response = {
      setCookie: jest.fn(),
      send: jest.fn()
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
         await controller.signup(createUserDto, response);
      });

      it("should be defined", () => {
         expect(controller.signup).toBeDefined();
      });

      it("should be called with correct params", () => {
         expect(service.signup).toBeCalledWith(createUserDto);
      });

      it("should set cookie with correct params", () => {
         expect(response.setCookie).toBeCalledWith(
            "reshare-refresh-token",
            tokens.refreshToken,
            {
               httpOnly: true,
               maxAge: 60 * 60 * 24 * 15,
               sameSite: "lax"
            }
         );
      });

      it("should send response with correct data", () => {
         expect(response.send).toBeCalledWith(tokens);
      });
   });

   describe("signin", () => {
      let signinUserDto: SigninUserDto;

      beforeEach(async () => {
         signinUserDto = signInUserStub();
         await controller.signin(signinUserDto, response);
      });

      it("should be defined", () => {
         expect(controller.signin).toBeDefined();
      });

      it("should be called with correct params", () => {
         expect(service.signin).toBeCalledWith(signinUserDto);
      });

      it("should call setCookie method of response with correct params", () => {
         expect(response.setCookie).toBeCalledWith(
            "reshare-refresh-token",
            tokens.refreshToken,
            {
               httpOnly: true,
               maxAge: 60 * 60 * 24 * 15,
               sameSite: "lax"
            }
         );
      });

      it("should call send method of response with correct params", () => {
         expect(response.send).toBeCalledWith(tokens);
      });
   });

   describe("signout", () => {
      let userPayload: UserPayload;

      beforeEach(async () => {
         userPayload = userPayloadStub();
         await controller.signout(userPayload);
      });

      it("should be defined", () => {
         expect(controller.signout).toBeDefined();
      });

      it("should be called with correct params", () => {
         expect(service.signout).toBeCalledWith(userPayload);
      });
   });

   describe("refresh", () => {
      let refreshPayload: RefreshPayload;

      beforeEach(async () => {
         refreshPayload = refreshPayloadSetNewStub();
         await controller.refresh(refreshPayload, response);
      });

      it("should be defined", () => {
         expect(controller.refresh).toBeDefined();
      });

      it("should be called with correct params", () => {
         expect(service.refresh).toBeCalledWith(refreshPayload, true);
      });

      it("should call setCookie method of response with correct params", () => {
         expect(response.setCookie).toBeCalledWith(
            "reshare-refresh-token",
            tokens.refreshToken,
            {
               httpOnly: true,
               maxAge: 60 * 60 * 24 * 15,
               sameSite: "lax"
            }
         );
      });

      it("should call send method of response with correct params", () => {
         expect(response.send).toBeCalledWith(tokens);
      });

      it("should return access token if refresh token is still fresh", async () => {
         refreshPayload = refreshPayloadStub();
         await controller.refresh(refreshPayload, response);
         expect(service.refresh).toBeCalledWith(refreshPayload, false);
      });
   });
});
