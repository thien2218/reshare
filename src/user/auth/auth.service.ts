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
import { RefreshPayload, UserPayload } from "src/decorators/payload.decorator";

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};

type User = {
   id: string;
   email: string;
   username: string;
   firstName: string;
   lastName: string;
   emailVerified: boolean;
};

@Injectable()
export class AuthService {
   constructor(
      @Inject(DB_CONNECTION)
      private readonly dbService: LibSQLDatabase<typeof schema>,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService
   ) {}

   async signup({ password, ...data }: CreateUserDto): Promise<Tokens> {
      const encryptedPassword = await bcrypt.hash(password, 12);
      const now = new Date();
      now.setMilliseconds(0);

      const values = {
         id: nanoid(25),
         ...data,
         createdAt: now.toISOString().replace(".000", ""),
         updatedAt: now.toISOString().replace(".000", ""),
         emailVerified: false,
         encryptedPassword
      };

      const tokens = await this.generateTokens(values);
      const refreshToken = await bcrypt.hash(tokens.refreshToken, 10);

      const prepared = this.dbService
         .insert(schema.users)
         .values(this.userInsertPlaceholder())
         .prepare();

      await prepared.run({ ...values, refreshToken }).catch((err) => {
         if (err instanceof LibsqlError) this.handleDbError(err);
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

   async signout({ sub, refresh_token }: RefreshPayload): Promise<string> {
      await this.checkRefreshToken(sub, refresh_token);

      await this.dbService
         .update(schema.users)
         .set({ refreshToken: null })
         .where(eq(schema.users.id, sub))
         .run()
         .catch((err) => {
            if (err instanceof LibsqlError) this.handleDbError(err);
         });

      return "User successfully signed out";
   }

   async refresh(
      { sub, refresh_token }: RefreshPayload,
      tokenExpired: boolean
   ): Promise<Tokens> {
      const user = await this.checkRefreshToken(sub, refresh_token);
      const tokens = await this.generateTokens(user);

      if (tokenExpired) {
         const refreshToken = await bcrypt.hash(tokens.refreshToken, 10);

         await this.dbService
            .update(schema.users)
            .set({ refreshToken })
            .where(eq(schema.users.id, sub))
            .run()
            .catch((err) => {
               if (err instanceof LibsqlError) this.handleDbError(err);
            });
      }

      return tokens;
   }

   // PRIVATE

   private async generateTokens(user: User): Promise<Tokens> {
      const payload: UserPayload = {
         sub: user.id,
         email: user.email,
         username: user.username,
         first_name: user.firstName,
         last_name: user.lastName,
         email_verified: user.emailVerified
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

   private async checkRefreshToken(sub: string, refreshToken: string) {
      const prepared = this.dbService.query.users
         .findFirst({
            where: eq(schema.users.id, placeholder("id"))
         })
         .prepare();

      const user = await prepared.get({ id: sub });

      if (!user) {
         throw new BadRequestException("Invalid refresh token");
      }

      const isValidRefreshToken = await bcrypt.compare(
         refreshToken,
         user.refreshToken as string
      );

      if (!isValidRefreshToken) {
         throw new BadRequestException("Invalid refresh token");
      }

      return user;
   }

   private userInsertPlaceholder() {
      return {
         id: placeholder("id"),
         email: placeholder("email"),
         username: placeholder("username"),
         firstName: placeholder("firstName"),
         lastName: placeholder("lastName"),
         emailVerified: placeholder("emailVerified"),
         encryptedPassword: placeholder("encryptedPassword"),
         createdAt: placeholder("createdAt"),
         updatedAt: placeholder("updatedAt"),
         refreshToken: placeholder("refreshToken")
      };
   }

   private handleDbError(err: LibsqlError) {
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
