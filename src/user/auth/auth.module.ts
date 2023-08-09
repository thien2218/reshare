import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DatabaseModule } from "src/database/database.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
   imports: [DatabaseModule, JwtModule],
   providers: [AuthService],
   controllers: [AuthController]
})
export class AuthModule {}
