import { type Review, type Summary } from '../generated/prisma';
import OpenAI from 'openai';
import { reviewRepository } from '../repositories/review.repository';

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return await reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      const prompt = `Summarize the following customer reviews into a short paragraph highlighting the key themes , both positive and negative:
      
      ${joinedReviews}`;

      const response = await client.responses.create({
         model: 'gpt-4.1',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 500,
      });
      return response.output_text;
   },
};
