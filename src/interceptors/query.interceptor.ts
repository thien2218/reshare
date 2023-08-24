import {
   Injectable,
   NestInterceptor,
   ExecutionContext,
   CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class ParseIntQueryInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const query = request.query;

      // Transform the limit from string to integer
      if (query.limit) {
         query.limit = parseInt(query.limit);
      }
      // Add a property called "offset" and remove the page property
      if (query.page) {
         query.page = parseInt(query.page);
      }

      return next.handle();
   }
}
