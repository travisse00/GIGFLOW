import {
Star,
User,
MessageSquare,
} from "lucide-react";

function Reviews({ reviews = [] }) {
if (reviews.length === 0) {
return ( <div className="rounded-xl border border-gray-800 bg-gray-900/50 py-14 text-center"> <MessageSquare
       size={30}
       className="mx-auto text-gray-600"
     />


    <h3 className="mt-4 font-medium">
      No reviews yet
    </h3>

    <p className="mt-2 text-sm text-gray-500">
      Reviews will appear here after completed orders.
    </p>
  </div>
);


}

return ( <div className="space-y-4">
{reviews.map((review) => ( <div
       key={review._id}
       className="rounded-xl border border-gray-800 bg-gray-900 p-5"
     > <div className="flex items-start justify-between gap-4"> <div className="flex items-center gap-3">
{review.reviewer?.profileImage ? ( <img
               src={review.reviewer.profileImage}
               alt={review.reviewer.name}
               className="h-10 w-10 rounded-full object-cover"
             />
) : ( <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-500"> <User size={18} /> </div>
)}


          <div>
            <p className="font-medium">
              {review.reviewer?.name ||
                "Anonymous"}
            </p>

            <p className="text-xs text-gray-500">
              {review.createdAt
                ? new Date(
                    review.createdAt
                  ).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <Star
                key={star}
                size={15}
                className={
                  star <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-700"
                }
              />
            )
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-400">
        {review.comment}
      </p>
    </div>
  ))}
</div>
);
}

export default Reviews;
