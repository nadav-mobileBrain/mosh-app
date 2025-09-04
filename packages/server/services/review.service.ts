import { type Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return await reviewRepository.getReviews(productId);
   },
};
