import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import api from "../Services/api";

function ReviewForm({ orderId, onReviewSubmitted }) {
const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);
const [comment, setComment] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();


if (!rating) {
  setError("Please select a rating.");
  return;
}

if (!comment.trim()) {
  setError("Please write a review.");
  return;
}

try {
  setLoading(true);
  setError("");

  const response = await api.post("/reviews", {
    orderId,
    rating,
    comment: comment.trim(),
  });

  setComment("");
  setRating(0);
  setHoverRating(0);

  if (onReviewSubmitted) {
    onReviewSubmitted(response.data.review);
  }
} catch (error) {
  console.error(
    "CREATE REVIEW ERROR:",
    error.response?.data || error
  );

  setError(
    error.response?.data?.message ||
      "Failed to submit review."
  );
} finally {
  setLoading(false);
}


};

return ( <form
   onSubmit={handleSubmit}
   className="rounded-xl border border-gray-800 bg-gray-900 p-6"
 > <div> <h3 className="text-lg font-semibold">
Leave a review </h3>


    <p className="mt-1 text-sm text-gray-500">
      Share your experience with this order.
    </p>
  </div>

  {/* Rating */}

  <div className="mt-6">
    <p className="mb-2 text-sm font-medium text-gray-300">
      Rating
    </p>

    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() =>
            setHoverRating(star)
          }
          onMouseLeave={() =>
            setHoverRating(0)
          }
          onClick={() =>
            setRating(star)
          }
          className="p-1 transition"
          aria-label={`Rate ${star} out of 5`}
        >
          <Star
            size={24}
            className={
              star <=
              (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
            }
          />
        </button>
      ))}
    </div>
  </div>

  {/* Comment */}

  <div className="mt-6">
    <label
      htmlFor="review"
      className="mb-2 block text-sm font-medium text-gray-300"
    >
      Review
    </label>

    <textarea
      id="review"
      value={comment}
      onChange={(e) =>
        setComment(e.target.value)
      }
      rows={5}
      placeholder="How was your experience?"
      className="w-full resize-none rounded-md border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
    />
  </div>

  {/* Error */}

  {error && (
    <p className="mt-3 text-sm text-red-400">
      {error}
    </p>
  )}

  {/* Submit */}

  <button
    type="submit"
    disabled={loading}
    className="mt-5 inline-flex items-center gap-2 rounded-md bg-violet-600 px-5 py-2.5 text-sm font-medium transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? (
      <>
        <Loader2
          size={16}
          className="animate-spin"
        />
        Submitting...
      </>
    ) : (
      "Submit Review"
    )}
  </button>
</form>


);
}

export default ReviewForm;