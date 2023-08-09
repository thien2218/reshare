import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { JwtService } from "@nestjs/jwt";
import { nanoid } from "nanoid";
import * as bcrypt from "bcrypt";
import { DB_CONNECTION } from "src/constants";
import { CreateUserDto } from "src/schemas/user.schema";
import { UserPayload } from "src/decorators/user.decorator";
import * as schema from "../../schemas";

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};

@Injectable()
export class AuthService {
   constructor(
      @Inject(DB_CONNECTION) private readonly dbService: LibSQLDatabase,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService
   ) {}

   // PUBLIC

   async signup(createUserDto: CreateUserDto): Promise<Tokens> {
      const encryptedPassword = await bcrypt.hash(createUserDto.password, 12);
      const now = new Date();

      const values = {
         id: nanoid(25),
         ...createUserDto,
         createdAt: now.toUTCString(),
         updatedAt: now.toUTCString(),
         encryptedPassword
      };

      const payload = {
         sub: values.id,
         email: values.email,
         first_name: values.firstName,
         last_name: values.lastName
      };

      const tokens = await this.generateTokens(payload);

      const result = await this.dbService
         .insert(schema.users)
         .values({
            ...values,
            refreshToken: tokens.refreshToken
         })
         .run();

      console.log(result);

      if (!result) {
         throw new BadRequestException();
      }

      return tokens;
   }

   async signin() {}

   async signout() {}

   async refresh() {}

   // PRIVATE

   private async generateTokens(payload: UserPayload): Promise<Tokens> {
      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("ACCESS_TOKEN_EXPIRES_IN")
         }),
         this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>(
               "REFRESH_TOKEN_EXPIRES_IN"
            )
         })
      ]);

      return { accessToken, refreshToken };
   }
}
