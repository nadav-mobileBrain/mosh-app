import axios from 'axios';
import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';

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
   const [reviewData, setReviewData] = useState<GetReviewsResponse | null>(
      null
   );
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const fetchReviews = async () => {
      try {
         setIsLoading(true);
         const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
         );
         setReviewData(data);
      } catch (error) {
         console.log(error);
         setError('Failed to fetch reviews');
      } finally {
         setIsLoading(false);
      }
   };
   useEffect(() => {
      fetchReviews();
   }, []);
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
      return <div className="text-red-500 text-sm">{error}</div>;
   }

   return (
      <div className="flex flex-col gap-5">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <StarRating value={review.rating} />
               <p className="py-2">{review.content}</p>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;
