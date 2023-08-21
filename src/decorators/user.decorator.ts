import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export type User = {
   sub: string;
   username: string;
   first_name: string;
   last_name: string;
   email: string;
   email_verified: boolean;
};

export type UserRefresh = User & {
   refresh_token: string;
   exp: number;
};

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest();
   return req.user;
});
