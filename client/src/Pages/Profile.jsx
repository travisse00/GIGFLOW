import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  BriefcaseBusiness,
  Loader2,
  Tag,
  DollarSign,
  Star,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../Services/api";

function Profile() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [error, setError] = useState("");

  /*
  ========================================
  FETCH PROFILE
  ========================================
  */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/users/${id}`
        );

        setProfile(response.data.user);
        setGigs(response.data.gigs || []);
      } catch (error) {
        console.error(
          "GET PROFILE ERROR:",
          error.response?.data || error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  /*
  ========================================
  FETCH REVIEWS
  ========================================
  */

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await api.get(
          `/reviews/freelancer/${id}`
        );

        setReviews(
          response.data.reviews || []
        );
      } catch (error) {
        console.error(
          "GET REVIEWS ERROR:",
          error.response?.data || error
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2
            size={30}
            className="animate-spin text-violet-500"
          />
        </div>
      </main>
    );
  }

  /*
  ========================================
  ERROR
  ========================================
  */

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">

          <Link
            to="/gigs"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="mt-10 rounded-xl border border-red-900 bg-red-950/30 p-10 text-center">

            <h1 className="text-xl font-semibold">
              Profile not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error ||
                "This user doesn't exist."}
            </p>

          </div>
        </div>
      </main>
    );
  }

  /*
  ========================================
  PROFILE DATA
  ========================================
  */

  const profileImage =
    profile.profileImage ||
    profile.image ||
    null;

  const role =
    profile.role || "user";

  /*
  ========================================
  RATING
  ========================================
  */

  const totalReviews =
    reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (sum, review) =>
            sum + Number(review.rating || 0),
          0
        ) / totalReviews
      : 0;

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <Link
          to="/gigs"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to gigs
        </Link>

        {/* ========================================
            PROFILE CARD
        ======================================== */}

        <section className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">

          {/* COVER */}

          <div className="h-32 bg-gradient-to-r from-violet-950 via-gray-900 to-gray-950" />

          {/* PROFILE CONTENT */}

          <div className="px-6 pb-7 md:px-8">

            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">

              {/* AVATAR */}

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profile.name}
                  className="h-24 w-24 rounded-xl border-4 border-gray-900 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border-4 border-gray-900 bg-gray-800 text-gray-500">
                  <User size={38} />
                </div>
              )}

              {/* NAME */}

              <div className="pb-1">

                <h1 className="text-2xl font-bold">
                  {profile.name ||
                    "Unnamed User"}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium capitalize text-violet-400">
                    <BriefcaseBusiness
                      size={13}
                    />
                    {role}
                  </span>

                </div>

              </div>
              <Link
  to="/edit-profile"
  className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-700"
>
  Edit Profile
</Link>

            </div>

            {/* BIO */}

            <div className="mt-7 max-w-2xl">

              <p className="text-sm leading-7 text-gray-400">
                {profile.bio ||
                  "This user hasn't added a bio yet."}
              </p>

            </div>

            {/* USER INFO */}

            <div className="mt-7 flex flex-wrap gap-5 border-t border-gray-800 pt-6">

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={16} />
                {profile.email}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <BriefcaseBusiness size={16} />
                {gigs.length}{" "}
                {gigs.length === 1
                  ? "gig"
                  : "gigs"}
              </div>

            </div>

          </div>
        </section>

        {/* ========================================
            RATING SUMMARY
        ======================================== */}

        {role === "freelancer" && (
          <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm text-gray-500">
                  Overall rating
                </p>

                <div className="mt-1 flex items-center gap-3">

                  <span className="text-3xl font-bold">
                    {averageRating
                      ? averageRating.toFixed(1)
                      : "0.0"}
                  </span>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={18}
                          fill={
                            star <=
                            Math.round(
                              averageRating
                            )
                              ? "currentColor"
                              : "none"
                          }
                          className={
                            star <=
                            Math.round(
                              averageRating
                            )
                              ? "text-violet-500"
                              : "text-gray-700"
                          }
                        />
                      )
                    )}
                  </div>

                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {totalReviews}{" "}
                  {totalReviews === 1
                    ? "review"
                    : "reviews"}
                </p>
              </div>

            </div>

          </section>
        )}

        {/* ========================================
            GIGS
        ======================================== */}

        <section className="mt-10">

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              {role === "freelancer"
                ? "Services"
                : "Gigs"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Services offered by{" "}
              {profile.name ||
                "this user"}.
            </p>

          </div>

          {gigs.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 py-16 text-center">

              <BriefcaseBusiness
                size={30}
                className="mx-auto text-gray-600"
              />

              <h3 className="mt-4 font-medium">
                No gigs yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                This user hasn't created any gigs.
              </p>

            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {gigs.map((gig) => (
                <div
                  key={gig._id}
                  className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition hover:-translate-y-1 hover:border-gray-700"
                >

                  {gig.image ? (
                    <img
                      src={gig.image}
                      alt={gig.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-gray-800 text-gray-600">
                      <BriefcaseBusiness
                        size={32}
                      />
                    </div>
                  )}

                  <div className="p-5">

                    {gig.category && (
                      <div className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-violet-400">
                        <Tag size={13} />
                        {gig.category}
                      </div>
                    )}

                    <h3 className="line-clamp-2 text-lg font-medium">
                      {gig.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                      {gig.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-800 pt-4">

                      <div>

                        <p className="text-xs text-gray-500">
                          Starting at
                        </p>

                        <div className="mt-1 flex items-center gap-1 font-semibold">

                          <DollarSign size={15} />

                          ₦
                          {Number(
                            gig.price || 0
                          ).toLocaleString()}

                        </div>

                      </div>

                      <Link
                        to={`/gigs/${gig._id}`}
                        className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-700"
                      >
                        View Gig
                      </Link>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* ========================================
            REVIEWS
        ======================================== */}

        {role === "freelancer" && (
          <section className="mt-12">

            <div className="mb-6">

              <h2 className="text-xl font-semibold">
                Reviews
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                What clients say about{" "}
                {profile.name || "this freelancer"}.
              </p>

            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2
                  size={25}
                  className="animate-spin text-violet-500"
                />
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 py-16 text-center">

                <Star
                  size={30}
                  className="mx-auto text-gray-600"
                />

                <h3 className="mt-4 font-medium">
                  No reviews yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  This freelancer hasn't received any reviews yet.
                </p>

              </div>
            ) : (
              <div className="space-y-4">

                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-xl border border-gray-800 bg-gray-900 p-6"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <p className="font-medium">
  {review.reviewer?.name || "Anonymous"}
</p>
                        <div className="mt-2 flex gap-1">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <Star
                                key={star}
                                size={15}
                                fill={
                                  star <=
                                  Number(
                                    review.rating
                                  )
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  star <=
                                  Number(
                                    review.rating
                                  )
                                    ? "text-violet-500"
                                    : "text-gray-700"
                                }
                              />
                            )
                          )}

                        </div>

                      </div>

                      {review.createdAt && (
                        <p className="text-xs text-gray-600">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString()}
                        </p>
                      )}

                    </div>

                    {review.comment && (
                      <p className="mt-5 text-sm leading-7 text-gray-400">
                        {review.comment}
                      </p>
                    )}

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

      </div>

    </main>
  );
}

export default Profile;
