import { Injectable } from "@nestjs/common";

@Injectable()
export class TagService {
   async addTags(resId: string, userId: string, tags: string[]) {
      return [];
   }

   async removeTags(resId: string, userId: string, tags: string[]) {
      return;
   }
}
