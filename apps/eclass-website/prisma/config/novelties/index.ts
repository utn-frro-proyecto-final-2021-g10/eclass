import type { PrismaClient } from "@prisma/client";
import { novelties } from "./data";

export const createNovelties = async (prisma: PrismaClient) => {
  await Promise.all(
    novelties.map(async (novelty, i) => {
      const noveltyData = await prisma.novelty.create({
        data: {
          ...novelty,
          date: new Date(),
        },
      });

      console.log(`🙎 Novelty "${noveltyData.title}" created: `);
      console.table(noveltyData);
    })
  );
};
