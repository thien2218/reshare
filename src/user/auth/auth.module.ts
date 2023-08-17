import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DatabaseModule } from "src/database/database.module";
import { JwtModule } from "@nestjs/jwt";
import { AccessStrategy } from "./strategies/access.strategy";
import { RefreshStrategy } from "./strategies/refresh.strategy";

@Module({
   imports: [DatabaseModule, JwtModule],
   providers: [AuthService, AccessStrategy, RefreshStrategy],
   controllers: [AuthController]
})
export class AuthModule {}
