import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { nanoid } from "nanoid";
import * as bcrypt from "bcrypt";
import { CreateUserDto, SigninUserDto } from "src/schemas/user.schema";
import * as schema from "../../schemas";
import { eq, placeholder } from "drizzle-orm";
import { UserRefresh, User } from "src/decorators/user.decorator";
import { getTimestamp } from "src/utils/getTimestamp";
import { DatabaseService } from "src/database/database.service";

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};

type UserPayload = {
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
      private readonly dbService: DatabaseService,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService
   ) {}

   async signup({ password, ...data }: CreateUserDto): Promise<Tokens> {
      const encryptedPassword = await bcrypt.hash(password, 12);

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
      const refreshToken = await bcrypt.hash(tokens.refreshToken, 10);

      const prepared = this.dbService.db
         .insert(schema.users)
         .values(this.userPlaceholders())
         .prepare();

      await prepared
         .run({ ...values, refreshToken })
         .catch(this.dbService.handleDbError);

      return tokens;
   }

   async signin({ email, password }: SigninUserDto): Promise<Tokens> {
      const preparedFind = this.dbService.db.query.users
         .findFirst({
            where: eq(schema.users.email, placeholder("email"))
         })
         .prepare();

      const user = await preparedFind.get({ email });

      if (!user) {
         throw new BadRequestException("Incorrect email or password");
      }

      const isValidPw = await bcrypt
         .compare(password, user.encryptedPassword as string)
         .catch(() => false);

      if (!isValidPw) {
         throw new BadRequestException("Incorrect email or password");
      }

      const tokens = await this.generateTokens(user);
      const refreshToken = await bcrypt.hash(tokens.refreshToken, 10);

      const preparedUpdate = this.dbService.db
         .update(schema.users)
         .set({ refreshToken })
         .where(eq(schema.users.id, placeholder("id")))
         .prepare();

      await preparedUpdate
         .run({ id: user.id })
         .catch(this.dbService.handleDbError);

      return tokens;
   }

   async signout({ sub, refresh_token }: UserRefresh): Promise<string> {
      await this.checkRefreshToken(sub, refresh_token);

      const prepared = this.dbService.db
         .update(schema.users)
         .set({ refreshToken: null })
         .where(eq(schema.users.id, placeholder("id")));

      await prepared.run({ id: sub }).catch(this.dbService.handleDbError);

      return "User successfully signed out";
   }

   async refresh(
      { sub, refresh_token }: UserRefresh,
      tokenExpired: boolean
   ): Promise<Tokens> {
      const user = await this.checkRefreshToken(sub, refresh_token);
      const tokens = await this.generateTokens(user);

      if (tokenExpired) {
         const refreshToken = await bcrypt.hash(tokens.refreshToken, 10);

         const prepared = this.dbService.db
            .update(schema.users)
            .set({ refreshToken })
            .where(eq(schema.users.id, placeholder("id")));

         await prepared.run({ id: sub }).catch(this.dbService.handleDbError);
      }

      return tokens;
   }

   // PRIVATE

   private async generateTokens(user: UserPayload): Promise<Tokens> {
      const payload: User = {
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
      const prepared = this.dbService.db.query.users
         .findFirst({
            where: eq(schema.users.id, placeholder("id"))
         })
         .prepare();

      const user = await prepared.get({ id: sub });

      if (!user) {
         throw new BadRequestException("Invalid refresh token");
      }

      const isValidRefreshToken = await bcrypt
         .compare(refreshToken, user.refreshToken as string)
         .catch(() => false);

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
