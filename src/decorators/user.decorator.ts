import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export type UserPayload = {
   sub: string;
   first_name: string;
   last_name: string;
   email: string;
   // Only appear upon refresh requests
   refresh_token?: string;
};

export type RefreshPayload = UserPayload & {
   refresh_token: string;
   exp: number;
};

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest();
   return req.user;
});
