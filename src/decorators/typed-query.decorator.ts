import {
   createParamDecorator,
   ExecutionContext,
   PipeTransform,
   Type
} from "@nestjs/common";

export function TypedQuery(...pipes: (Type<PipeTransform> | PipeTransform)[]) {
   return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.query;
   })(...pipes);
}
