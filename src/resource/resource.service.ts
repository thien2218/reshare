import { BadRequestException, Injectable } from "@nestjs/common";
import { and, eq, placeholder, sql } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";
import { resources, reactions } from "src/database/tables";
import { UpdateResourceDto } from "src/schemas/resource.schema";

@Injectable()
export class ResourceService {
   constructor(private readonly dbService: DatabaseService) {}

   async update(
      id: string,
      userId: string,
      updateResourceDto: UpdateResourceDto
   ) {
      const prepared = this.dbService.db
         .update(resources)
         .set(updateResourceDto)
         .where(
            and(
               eq(resources.id, placeholder("id")),
               eq(resources.authorId, placeholder("userId"))
            )
         )
         .prepare();

      const { rowsAffected } = await prepared.run({ id, userId });

      if (rowsAffected === 0)
         throw new BadRequestException("Resource not found");
   }

   async react(id: string, userId: string, type: "like" | "dislike") {
      const column: "likeCount" | "dislikeCount" = `${type}Count`;

      await this.dbService.db.transaction(async (txn) => {
         const prepared = txn.insert(reactions).values({
            userId: placeholder("userId"),
            reactableId: placeholder("id"),
            type: placeholder("type"),
            reactableType: "resource"
         });

         let result = await prepared.run({ userId, id, type });
         if (result.rowsAffected === 0)
            throw new BadRequestException(`This user's ${type} already exists`);

         const query = sql`
            UPDATE ${resources}
            SET ${resources[column]} = ${resources[column]} + 1
            WHERE ${resources.id} = ${id}
         `;

         result = await txn.run(query);
         if (result.rowsAffected === 0)
            throw new BadRequestException("Resource not found");
      });
   }

   async unreact(id: string, userId: string, type: "like" | "dislike") {
      const column: "likeCount" | "dislikeCount" = `${type}Count`;

      await this.dbService.db.transaction(async (txn) => {
         const prepared = txn
            .delete(reactions)
            .where(
               and(
                  eq(reactions.userId, placeholder("userId")),
                  eq(reactions.reactableId, placeholder("id")),
                  eq(reactions.type, placeholder("type"))
               )
            );

         let result = await prepared.run({ userId, id, type });
         if (result.rowsAffected === 0)
            throw new BadRequestException(`This user's ${type} does not exist`);

         const query = sql`
            UPDATE ${resources}
            SET ${resources[column]} = ${resources[column]} - 1
            WHERE ${resources.id} = ${id}
         `;

         result = await txn.run(query);
         if (result.rowsAffected === 0)
            throw new BadRequestException("Resource not found");
      });
   }
}
