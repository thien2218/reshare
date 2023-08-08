import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { DB_CONNECTION } from "src/constants";
import { CreateUserDto } from "src/database/schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { UserPayload } from "src/decorators/user.decorator";
import * as bcrypt from "bcrypt";
import * as schema from "../../database/schemas";

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

      const user = await this.dbService
         .insert(schema.users)
         .values({
            // TODO: Replace this with an ID generator
            id: "some_random_id",
            ...createUserDto,
            createdAt: now.toUTCString(),
            updatedAt: now.toUTCString(),
            encryptedPassword
         })
         .returning()
         .get();

      console.log(user);

      if (!user) {
         throw new BadRequestException();
      }

      const payload = {
         sub: user.id,
         email: user.email,
         first_name: user.firstName,
         last_name: user.lastName
      };

      return this.generateTokens(payload);
   }

   async signin() {}

   async signout() {}

   async refresh() {}

   // PRIVATE

   private async generateTokens(payload: UserPayload): Promise<Tokens> {
      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>("ACCESS_TOKEN_SECRET")
         }),
         this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
            expiresIn: 60 * 60 * 24 * 7
         })
      ]);

      return { accessToken, refreshToken };
   }
}
