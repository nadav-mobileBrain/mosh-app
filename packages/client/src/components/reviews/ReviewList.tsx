import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   rating: number;
   content: string;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};
const ReviewList = ({ productId }: Props) => {
   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse, Error>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((item) => (
               <div key={item}>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton count={2} />
               </div>
            ))}
         </div>
      );
   }
   if (error) {
      return (
         <div className="text-red-500 text-sm">
            Could not load reviews, please try again later
         </div>
      );
   }
   if (reviewData?.reviews.length === 0) {
      return null;
   }

   return (
      <div>
         <div className="mb-5">
            {reviewData?.summary ? (
               <p>{reviewData?.summary}</p>
            ) : (
               <Button>
                  <HiSparkles />
                  Summarize Reviews
               </Button>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
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
