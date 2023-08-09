import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService, Tokens } from "./auth.service";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { CreateUserDto, CreateUserSchema } from "src/schemas/user.schema";

@Controller("auth")
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post("signup")
   async signup(
      @Body(new ZodValidationPipe(CreateUserSchema))
      createUserDto: CreateUserDto
   ): Promise<Tokens> {
      return this.authService.signup(createUserDto);
   }

   @Post("signin")
   async signin() {}

   @Post("signout")
   async signout() {}

   @Post("refresh")
   async refresh() {}
}
