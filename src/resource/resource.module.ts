import { Module } from "@nestjs/common";
import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";
import { AccessStrategy } from "src/user/auth/strategies/access.strategy";
import { DatabaseModule } from "src/database/database.module";

@Module({
   controllers: [ResourceController],
   providers: [ResourceService, AccessStrategy],
   imports: [DatabaseModule]
})
export class ResourceModule {}
