import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   Res,
   UseGuards
} from "@nestjs/common";
import {
   CreateUserDto,
   CreateUserSchema,
   SigninUserDto,
   SigninUserSchema
} from "src/schemas/user.schema";
import { Payload, RefreshPayload } from "src/decorators/payload.decorator";
import { FastifyReply } from "fastify";
import { AuthService } from "./auth.service";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { RefreshGuard } from "src/guards/refresh.guard";

@Controller("auth")
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post("signup")
   async signup(
      @Body(new ZodValidationPipe(CreateUserSchema))
      createUserDto: CreateUserDto,
      @Res() res: FastifyReply
   ) {
      const tokens = await this.authService.signup(createUserDto);
      this.setRefreshTokenCookie(res, tokens.refreshToken);
      res.send(tokens);
   }

   @Post("signin")
   async signin(
      @Body(new ZodValidationPipe(SigninUserSchema))
      signinUserDto: SigninUserDto,
      @Res() res: FastifyReply
   ) {
      const tokens = await this.authService.signin(signinUserDto);
      this.setRefreshTokenCookie(res, tokens.refreshToken);
      res.send(tokens);
   }

   @UseGuards(RefreshGuard)
   @Post("signout")
   async signout(
      @Payload() rfPayload: RefreshPayload,
      @Res() res: FastifyReply
   ) {
      res.clearCookie("reshare-refresh-token");
      const message = await this.authService.signout(rfPayload);
      res.send({ message });
   }

   @UseGuards(RefreshGuard)
   @Post("refresh")
   async refresh(
      @Payload() rfPayload: RefreshPayload,
      @Res() res: FastifyReply
   ) {
      // Check if the user's refresh token expires in less than 7 days (in seconds)
      // If so, generate a new refresh token and set it to cookie
      // Otherwise, just return a new access token
      const now = (new Date().getTime() / 1000) | 0;

      if (rfPayload.exp - now < 60 * 60 * 24 * 7) {
         const tokens = await this.authService.refresh(rfPayload, true);
         this.setRefreshTokenCookie(res, tokens.refreshToken);
         res.send(tokens);
      } else {
         const { accessToken } = await this.authService.refresh(
            rfPayload,
            false
         );
         res.send({ accessToken });
      }
   }

   // PRIVATE

   private async setRefreshTokenCookie(
      res: FastifyReply,
      refreshToken: string
   ) {
      res.setCookie("reshare-refresh-token", refreshToken, {
         httpOnly: true,
         maxAge: 60 * 60 * 24 * 15,
         sameSite: "lax"
      });
   }
}
