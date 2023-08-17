import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { CreateUserDto } from "src/schemas/user.schema";
import { FastifyReply } from "fastify";
import { createUserStub, tokensStub } from "./auth.stub";
import { AuthService } from "../auth.service";

jest.mock("../auth.service");

describe("AuthController", () => {
   let controller: AuthController;
   let service: AuthService;

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
      let response: FastifyReply;
      const tokens = tokensStub();

      beforeEach(async () => {
         createUserDto = createUserStub();
         response = {
            setCookie: jest.fn(),
            send: jest.fn()
         } as any;
         await controller.signup(createUserDto, response);
      });

      it("should be defined", () => {
         expect(controller.signup).toBeDefined();
      });

      it("should be called with correct params", () => {
         expect(service.signup).toHaveBeenCalledWith(createUserDto);
      });

      it("should set cookie with correct params", () => {
         expect(response.setCookie).toHaveBeenCalledWith(
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
         expect(response.send).toHaveBeenCalledWith(tokens);
      });
   });
});
