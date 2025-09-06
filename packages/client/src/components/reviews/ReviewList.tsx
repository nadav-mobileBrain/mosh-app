import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './ReviewSkeleton';
import {
   type SummarizeRespponse,
   type GetReviewsResponse,
   reviewsApi,
} from './reviewsApi';
type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const summaryMutation = useMutation<SummarizeRespponse, Error, void>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });
   const reviewsQuery = useQuery<GetReviewsResponse, Error>({
      queryKey: ['reviews', productId],
      queryFn: () => reviewsApi.fetchReviews(productId),
   });

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((item) => (
               <ReviewSkeleton key={item} />
            ))}
         </div>
      );
   }
   if (reviewsQuery.error) {
      return (
         <div className="text-red-500 text-sm">
            Could not load reviews, please try again later
         </div>
      );
   }
   if (reviewsQuery.data?.reviews.length === 0) {
      return null;
   }

   const currentSummary =
      reviewsQuery.data?.summary || summaryMutation.data?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles />
                     Summarize Reviews
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryMutation.error && (
                     <div className="text-red-500 text-sm">
                        Failed to generate summary
                     </div>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <StarRating value={review.rating} />
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
