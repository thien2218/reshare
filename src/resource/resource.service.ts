import { Injectable } from "@nestjs/common";
import { UpdateResourceDto } from "src/schemas/resource.schema";

@Injectable()
export class ResourceService {
   async update(
      id: string,
      userId: string,
      updateResourceDto: UpdateResourceDto
   ) {
      return;
   }

   async react(id: string, userId: string, type: string) {
      return;
   }
}
