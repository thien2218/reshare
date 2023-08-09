import {
   BadRequestException,
   Inject,
   Injectable,
   InternalServerErrorException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { JwtService } from "@nestjs/jwt";
import { nanoid } from "nanoid";
import * as bcrypt from "bcrypt";
import { DB_CONNECTION } from "src/constants";
import { CreateUserDto } from "src/schemas/user.schema";
import { UserPayload } from "src/decorators/user.decorator";
import * as schema from "../../schemas";
import { LibsqlError } from "@libsql/client";

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};

@Injectable()
export class AuthService {
   constructor(
      @Inject(DB_CONNECTION)
      private readonly dbService: LibSQLDatabase<typeof schema>,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService
   ) {}

   // PUBLIC

   async signup({ password, ...dto }: CreateUserDto): Promise<Tokens> {
      const encryptedPassword = await bcrypt.hash(password, 12);
      const now = new Date();
      now.setMilliseconds(0);

      const values = {
         id: nanoid(25),
         ...dto,
         createdAt: now.toISOString().replace(".000", ""),
         updatedAt: now.toISOString().replace(".000", ""),
         emailVerified: false,
         encryptedPassword
      };

      const payload = {
         sub: values.id,
         email: values.email,
         first_name: values.firstName,
         last_name: values.lastName
      };

      const tokens = await this.generateTokens(payload);

      await this.dbService
         .insert(schema.users)
         .values({
            ...values,
            refreshToken: tokens.refreshToken
         })
         .run()
         .catch((err) => {
            if (err instanceof LibsqlError) this.handleSignupErr(err);
         });

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

   private handleSignupErr(err: LibsqlError) {
      const splitErr = err.message.split(": ");
      const field = splitErr[splitErr.length - 1].split(".")[1];
      const reason = splitErr[splitErr.length - 2];

      const message = {
         reason,
         field
      };

      throw new BadRequestException([message]);
   }
}
