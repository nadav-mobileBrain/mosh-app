import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

export const reviewService = {
   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary) {
         return existingSummary;
      }
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      const summary = await llmClient.summarizeReviews(joinedReviews);
      await reviewRepository.storeReviewSummaries(productId, summary);
      return summary;
   },
};
