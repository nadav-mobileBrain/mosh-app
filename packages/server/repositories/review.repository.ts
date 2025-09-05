import { PrismaClient, type Review } from '../generated/prisma';
import dayjs from 'dayjs';
const prisma = new PrismaClient();
export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      return await prisma.review.findMany({
         where: {
            productId,
         },
         orderBy: {
            createdAt: 'desc',
         },
         take: limit,
      });
   },

   storeReviewSummaries(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs(now).add(7, 'day').toDate();
      const data = {
         content: summary,
         expiresAt,
         generatedAt: now,
         productId,
      };
      return prisma.summary.upsert({
         where: {
            productId,
         },

         create: data,
         update: data,
      });
   },

   async getReviewSummary(productId: number): Promise<string | null> {
      const summary = await prisma.summary.findFirst({
         where: {
            AND: [{ productId }, { expiresAt: { gt: new Date() } }],
         },
      });
      return summary?.content ?? null;
   },
};
