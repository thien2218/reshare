import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { JwtService } from "@nestjs/jwt";
import { nanoid } from "nanoid";
import * as bcrypt from "bcrypt";
import { DB_CONNECTION } from "src/constants";
import { CreateUserDto, SigninUserDto } from "src/schemas/user.schema";
import * as schema from "../../schemas";
import { LibsqlError } from "@libsql/client";
import { eq, placeholder } from "drizzle-orm";

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};

type User = {
   id: string;
   email: string;
   firstName: string;
   lastName: string;
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

      const tokens = await this.generateTokens(values);
      const refreshToken = await bcrypt.hash(tokens.refreshToken, 10);

      await this.dbService
         .insert(schema.users)
         .values({
            ...values,
            refreshToken
         })
         .run()
         .catch((err) => {
            if (err instanceof LibsqlError) this.handleSignupErr(err);
         });

      return tokens;
   }

   async signin({ email, password }: SigninUserDto): Promise<Tokens> {
      const prepared = this.dbService.query.users
         .findFirst({
            where: eq(schema.users.email, placeholder("email"))
         })
         .prepare();

      const user = await prepared.get({ email });

      if (!user) {
         throw new BadRequestException("Incorrect email or password");
      }

      const isValidPw = await bcrypt.compare(
         password,
         user.encryptedPassword as string
      );

      if (!isValidPw) {
         throw new BadRequestException("Incorrect email or password");
      }

      return this.generateTokens(user);
   }

   async signout() {}

   async refresh() {}

   // PRIVATE

   private async generateTokens(user: User): Promise<Tokens> {
      const payload = {
         sub: user.id,
         email: user.email,
         first_name: user.firstName,
         last_name: user.lastName
      };

      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
            expiresIn: 60 * 15
         }),
         this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
            expiresIn: 60 * 60 * 24 * 15
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
