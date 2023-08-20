import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "access") {
   constructor(protected configService: ConfigService) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET")
      });
   }

   async validate(payload: any, done: VerifiedCallback) {
      done(null, { payload });
   }
}
