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
import {
   RefreshPayload,
   User,
   UserPayload
} from "src/decorators/user.decorator";
import { FastifyReply } from "fastify";
import { AuthService, Tokens } from "./auth.service";
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
      @Res() response: FastifyReply
   ) {
      const tokens = await this.authService.signup(createUserDto);

      response.setCookie("reshare-refresh-token", tokens.refreshToken, {
         httpOnly: true,
         maxAge: 60 * 60 * 24 * 15,
         sameSite: "lax"
      });

      response.send(tokens);
   }

   @Post("signin")
   async signin(
      @Body(new ZodValidationPipe(SigninUserSchema))
      signinUserDto: SigninUserDto,
      @Res() response: FastifyReply
   ) {
      const tokens = await this.authService.signin(signinUserDto);

      response.setCookie("reshare-refresh-token", tokens.refreshToken, {
         httpOnly: true,
         maxAge: 60 * 60 * 24 * 15,
         sameSite: "lax"
      });

      response.send(tokens);
   }

   @Post("signout")
   async signout(@User() user: UserPayload) {
      return this.authService.signout(user);
   }

   @UseGuards(RefreshGuard)
   @Post("refresh")
   async refresh(
      @User() user: RefreshPayload,
      @Res() response: FastifyReply
   ): Promise<Tokens | { accessToken: string }> {
      // Check if the user's refresh token expires in less than 7 days (in seconds)
      // If so, generate a new refresh token and set it to cookie
      // Otherwise, just return a new access token
      const now = (new Date().getTime() / 1000) | 0;

      if (user.exp - now < 60 * 60 * 24 * 7) {
         const tokens = await this.authService.refresh(user, true);

         response.setCookie("reshare-refresh-token", tokens.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 15,
            sameSite: "lax"
         });

         return tokens;
      } else {
         const { accessToken } = await this.authService.refresh(user, true);
         return { accessToken };
      }
   }
}
