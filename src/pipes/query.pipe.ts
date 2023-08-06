import {
   PipeTransform,
   Injectable,
   ArgumentMetadata,
   BadRequestException
} from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class QueryPipe implements PipeTransform {
   constructor(private readonly schema: ZodSchema<any, any>) {}

   transform(value: any, metadata: ArgumentMetadata) {
      const parsed = this.schema.safeParse(value);

      if (parsed.success) {
         return parsed.data;
      } else {
         throw new BadRequestException(parsed.error.issues);
      }
   }
}
