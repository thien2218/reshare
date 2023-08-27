import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { nanoid } from "nanoid";
import { hash, compare } from "bcrypt";
import {
   CreateUserDto,
   SigninUserDto,
   RefreshUserDto,
   UserSchema
} from "src/schemas";
import { users } from "src/database/tables";
import { eq, placeholder } from "drizzle-orm";
import { getTimestamp } from "src/utils/getTimestamp";
import { DatabaseService } from "src/database/database.service";
import { input } from "zod";

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};

type UserPayload = input<typeof UserSchema>;

@Injectable()
export class AuthService {
   constructor(
      private readonly dbService: DatabaseService,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService
   ) {}

   async signup({ password, ...data }: CreateUserDto): Promise<Tokens> {
      const encryptedPassword = await hash(password, 12);

      const values = {
         id: nanoid(25),
         ...data,
         createdAt: getTimestamp(),
         updatedAt: getTimestamp(),
         provider: "email",
         emailVerified: false,
         encryptedPassword
      };

      const tokens = await this.generateTokens(values);
      const refreshToken = await hash(tokens.refreshToken, 10);

      const prepared = this.dbService.db
         .insert(users)
         .values(this.userPlaceholders())
         .prepare();

      await prepared
         .run({ ...values, refreshToken })
         .catch(this.dbService.handleDbError);

      return tokens;
   }

   async signin({ email, password }: SigninUserDto): Promise<Tokens> {
      const preparedFind = this.dbService.db
         .select()
         .from(users)
         .where(eq(users.email, placeholder("email")))
         .prepare();

      const user = await preparedFind.get({ email });

      if (!user) {
         throw new BadRequestException("Incorrect email or password");
      }

      const isValidPw = await compare(
         password,
         user.encryptedPassword as string
      ).catch(() => false);

      if (!isValidPw) {
         throw new BadRequestException("Incorrect email or password");
      }

      const tokens = await this.generateTokens(user);
      const refreshToken = await hash(tokens.refreshToken, 10);

      const preparedUpdate = this.dbService.db
         .update(users)
         .set({ refreshToken })
         .where(eq(users.id, placeholder("id")))
         .prepare();

      await preparedUpdate
         .run({ id: user.id })
         .catch(this.dbService.handleDbError);

      return tokens;
   }

   async signout({ sub, refreshToken }: RefreshUserDto): Promise<string> {
      await this.checkRefreshToken(sub, refreshToken);

      const prepared = this.dbService.db
         .update(users)
         .set({ refreshToken: null })
         .where(eq(users.id, placeholder("id")));

      await prepared.run({ id: sub }).catch(this.dbService.handleDbError);

      return "User successfully signed out";
   }

   async refresh(
      { sub, refreshToken }: RefreshUserDto,
      tokenExpired: boolean
   ): Promise<Tokens> {
      const user = await this.checkRefreshToken(sub, refreshToken);
      const tokens = await this.generateTokens(user);

      if (tokenExpired) {
         const newRefreshToken = await hash(tokens.refreshToken, 10);

         const prepared = this.dbService.db
            .update(users)
            .set({ refreshToken: newRefreshToken })
            .where(eq(users.id, placeholder("id")));

         await prepared.run({ id: sub }).catch(this.dbService.handleDbError);
      }

      return tokens;
   }

   // PRIVATE

   private async generateTokens(user: UserPayload): Promise<Tokens> {
      const payload = UserSchema.parse(user);

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
      const prepared = this.dbService.db
         .select()
         .from(users)
         .where(eq(users.id, placeholder("id")))
         .prepare();

      const user = await prepared.get({ id: sub });

      if (!user) {
         throw new BadRequestException("Invalid refresh token");
      }

      const isValidRefreshToken = await compare(
         refreshToken,
         user.refreshToken as string
      ).catch(() => false);

      if (!isValidRefreshToken) {
         throw new BadRequestException("Invalid refresh token");
      }

      return user;
   }

   private userPlaceholders() {
      return {
         id: placeholder("id"),
         email: placeholder("email"),
         username: placeholder("username"),
         firstName: placeholder("firstName"),
         lastName: placeholder("lastName"),
         emailVerified: placeholder("emailVerified"),
         encryptedPassword: placeholder("encryptedPassword"),
         provider: placeholder("provider"),
         refreshToken: placeholder("refreshToken"),

         photoUrl: placeholder("photoUrl"),
         bio: placeholder("bio"),

         createdAt: placeholder("createdAt"),
         updatedAt: placeholder("updatedAt")
      };
   }
}
