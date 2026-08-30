import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  X,
  Clock,
  Play,
  CircleCheck,
  Pencil,
  Eye,
  Loader2,
  ShoppingBag,
  TrendingUp,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../Context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [gigs, setGigs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [gigsLoading, setGigsLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  /*
  ========================================
  REVIEW STATE
  ========================================
  */

  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [reviewedOrders, setReviewedOrders] = useState({});

  /*
  ========================================
  FETCH ORDERS
  ========================================
  */

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my-orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "GET ORDERS ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    }
  };

  /*
  ========================================
  FETCH MY GIGS
  ========================================
  */

  const fetchGigs = async () => {
    try {
      setGigsLoading(true);

      const response = await api.get("/gigs");

      const allGigs =
        response.data.gigs || response.data || [];

      const userId =
        user?._id?.toString() ||
        user?.id?.toString() ||
        user?.userId?.toString();

      const myGigs = allGigs.filter((gig) => {
        const freelancerId =
          gig.freelancer?._id?.toString() ||
          gig.freelancer?.toString();

        return freelancerId === userId;
      });

      setGigs(myGigs);
    } catch (error) {
      console.error(
        "GET GIGS ERROR:",
        error.response?.data || error
      );
    } finally {
      setGigsLoading(false);
    }
  };

  /*
  ========================================
  CHECK EXISTING REVIEWS
  ========================================
  */

  const checkReviews = async (ordersList) => {
    if (user?.role !== "client") return;

    const completedOrders = ordersList.filter(
      (order) => order.status === "completed"
    );

    const results = {};

    await Promise.all(
      completedOrders.map(async (order) => {
        try {
          const response = await api.get(
            `/reviews/order/${order._id}`
          );

          if (response.data.review) {
            results[order._id] = true;
          }
        } catch (error) {
          console.error(
            "CHECK REVIEW ERROR:",
            error.response?.data || error
          );
        }
      })
    );

    setReviewedOrders(results);
  };

  /*
  ========================================
  INITIAL LOAD
  ========================================
  */

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      try {
        const ordersResponse =
          await api.get("/orders/my-orders");

        const fetchedOrders =
          ordersResponse.data.orders || [];

        setOrders(fetchedOrders);

        await Promise.all([
          fetchGigs(),
          checkReviews(fetchedOrders),
        ]);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboard();
    }
  }, [user]);

  /*
  ========================================
  ORDER ACTION
  ========================================
  */

  const handleOrderAction = async (
    orderId,
    action
  ) => {
    try {
      setActionLoading(`${action}-${orderId}`);

      let endpoint = "";

      if (action === "accept") {
        endpoint = `/orders/${orderId}/accept`;
      }

      if (action === "decline") {
        endpoint = `/orders/${orderId}/decline`;
      }

      if (action === "complete") {
        endpoint = `/orders/${orderId}/complete`;
      }

      if (action === "cancel") {
        endpoint = `/orders/${orderId}/cancel`;
      }

      if (!endpoint) return;

      const response =
        await api.patch(endpoint);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...response.data.order,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "ORDER ACTION ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  ========================================
  OPEN REVIEW
  ========================================
  */

  const openReview = (order) => {
    setReviewingOrder(order);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
  };

  /*
  ========================================
  CLOSE REVIEW
  ========================================
  */

  const closeReview = () => {
    if (reviewLoading) return;

    setReviewingOrder(null);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
  };

  /*
  ========================================
  SUBMIT REVIEW
  ========================================
  */

  const handleReviewSubmit = async () => {
    if (!reviewRating) {
      setReviewError(
        "Please select a rating."
      );
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError("");

      const response = await api.post(
        "/reviews",
        {
          orderId: reviewingOrder._id,
          rating: reviewRating,
          comment: reviewComment,
        }
      );

      console.log(
        "REVIEW CREATED:",
        response.data
      );

      setReviewedOrders((current) => ({
        ...current,
        [reviewingOrder._id]: true,
      }));

      closeReview();
    } catch (error) {
      console.error(
        "CREATE REVIEW ERROR:",
        error.response?.data || error
      );

      setReviewError(
        error.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  /*
  ========================================
  COUNTS
  ========================================
  */

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  const activeOrders = orders.filter(
    (order) => order.status === "active"
  );

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const incomingOrders =
    user?.role === "freelancer"
      ? pendingOrders
      : [];

  const clientOrders =
    user?.role === "client"
      ? orders
      : [];

  /*
  ========================================
  ORDER CARD
  ========================================
  */

  const OrderCard = ({ order }) => {
    const gig = order.gig;
    const client = order.client;
    const freelancer = order.freelancer;

    const isFreelancer =
      user?.role === "freelancer";

    const isClient =
      user?.role === "client";

    const busy = actionLoading?.includes(
      order._id
    );

    const hasReview =
      reviewedOrders[order._id];

    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

        {/* ORDER INFO */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-500">
              <BriefcaseBusiness size={21} />
            </div>

            <div>

              <h3 className="font-medium text-white">
                {gig?.title || "Gig"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {isFreelancer
                  ? `Client: ${
                      client?.name ||
                      "Unknown"
                    }`
                  : `Freelancer: ${
                      freelancer?.name ||
                      "Unknown"
                    }`}
              </p>

              <p className="mt-2 text-sm font-medium text-gray-300">
                ₦
                {Number(
                  order.price || 0
                ).toLocaleString()}
              </p>

            </div>

          </div>

          <StatusBadge
            status={order.status}
          />

        </div>

        {/* ACTIONS */}

        <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-800 pt-4">

          {/* FREELANCER ACCEPT / DECLINE */}

          {isFreelancer &&
            order.status === "pending" && (
              <>
                <button
                  onClick={() =>
                    handleOrderAction(
                      order._id,
                      "accept"
                    )
                  }
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {actionLoading ===
                  `accept-${order._id}` ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Check size={15} />
                  )}

                  Accept
                </button>

                <button
                  onClick={() =>
                    handleOrderAction(
                      order._id,
                      "decline"
                    )
                  }
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
                >
                  {actionLoading ===
                  `decline-${order._id}` ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <X size={15} />
                  )}

                  Decline
                </button>
              </>
            )}

          {/* FREELANCER COMPLETE */}

          {isFreelancer &&
            order.status === "active" && (
              <button
                onClick={() =>
                  handleOrderAction(
                    order._id,
                    "complete"
                  )
                }
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-700 disabled:opacity-50"
              >
                {actionLoading ===
                `complete-${order._id}` ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <CircleCheck size={15} />
                )}

                Complete
              </button>
            )}

          {/* CLIENT CANCEL */}

          {isClient &&
            (order.status === "pending" ||
              order.status === "active") && (
              <button
                onClick={() =>
                  handleOrderAction(
                    order._id,
                    "cancel"
                  )
                }
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 disabled:opacity-50"
              >
                {actionLoading ===
                `cancel-${order._id}` ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <X size={15} />
                )}

                Cancel
              </button>
            )}

          {/* LEAVE REVIEW */}

          {isClient &&
            order.status === "completed" &&
            (hasReview ? (
              <div className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-gray-500">
                <Check size={15} />
                Reviewed
              </div>
            ) : (
              <button
                onClick={() =>
                  openReview(order)
                }
                className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-700"
              >
                <Star size={15} />
                Leave Review
              </button>
            ))}

          {/* VIEW ORDER */}

          <Link
            to={`/orders/${order._id}`}
            className="inline-flex items-center gap-2 rounded-md border border-gray-800 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <Eye size={15} />
            View Order
          </Link>

          {/* VIEW GIG */}

          {gig?._id && (
            <Link
              to={`/gigs/${gig._id}`}
              className="inline-flex items-center gap-2 rounded-md border border-gray-800 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
              <BriefcaseBusiness
                size={15}
              />
              View Gig
            </Link>
          )}

        </div>
      </div>
    );
  };

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
  DASHBOARD
  ========================================
  */

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {user?.name || "Dashboard"}
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage your gigs and orders from here.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* STATS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<ShoppingBag size={19} />}
            label="Total Orders"
            value={orders.length}
          />

          <StatCard
            icon={<Clock size={19} />}
            label="Pending"
            value={pendingOrders.length}
          />

          <StatCard
            icon={<TrendingUp size={19} />}
            label="Active"
            value={activeOrders.length}
          />

          <StatCard
            icon={<CircleCheck size={19} />}
            label="Completed"
            value={completedOrders.length}
          />

        </div>

        {/* ========================================
            FREELANCER
        ======================================== */}

        {user?.role === "freelancer" && (
          <>

            {/* INCOMING ORDERS */}

            <section className="mt-10">

              <div className="mb-5">

                <h2 className="text-xl font-semibold">
                  Incoming Orders
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Orders waiting for your response.
                </p>

              </div>

              {incomingOrders.length === 0 ? (
                <EmptyState
                  icon={<InboxIcon />}
                  title="No incoming orders"
                  text="New orders from clients will appear here."
                />
              ) : (
                <div className="space-y-4">

                  {incomingOrders.map(
                    (order) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                      />
                    )
                  )}

                </div>
              )}

            </section>

            {/* MY ORDERS */}

            <section className="mt-10">

              <div className="mb-5">

                <h2 className="text-xl font-semibold">
                  My Orders
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Orders you have accepted or completed.
                </p>

              </div>

              {orders.filter(
                (order) =>
                  order.status !==
                  "pending"
              ).length === 0 ? (
                <EmptyState
                  icon={
                    <ShoppingBag size={30} />
                  }
                  title="No active orders"
                  text="Accepted orders will appear here."
                />
              ) : (
                <div className="space-y-4">

                  {orders
                    .filter(
                      (order) =>
                        order.status !==
                        "pending"
                    )
                    .map((order) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                      />
                    ))}

                </div>
              )}

            </section>

          </>
        )}

        {/* ========================================
            CLIENT
        ======================================== */}

        {user?.role === "client" && (
          <section className="mt-10">

            <div className="mb-5">

              <h2 className="text-xl font-semibold">
                My Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track the freelancers you have hired.
              </p>

            </div>

            {clientOrders.length === 0 ? (
              <EmptyState
                icon={
                  <ShoppingBag size={30} />
                }
                title="No orders yet"
                text="Explore gigs and hire a freelancer to get started."
              />
            ) : (
              <div className="space-y-4">

                {clientOrders.map(
                  (order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                    />
                  )
                )}

              </div>
            )}

          </section>
        )}

        {/* ========================================
            MY GIGS
        ======================================== */}

        {user?.role === "freelancer" && (
          <section className="mt-12">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  My Gigs
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage the services you offer.
                </p>

              </div>

              <Link
                to="/create-gig"
                className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-700"
              >
                <BriefcaseBusiness
                  size={16}
                />
                Create Gig
              </Link>

            </div>

            {gigsLoading ? (
              <div className="flex justify-center py-16">

                <Loader2
                  size={25}
                  className="animate-spin text-violet-500"
                />

              </div>
            ) : gigs.length === 0 ? (
              <EmptyState
                icon={
                  <BriefcaseBusiness
                    size={30}
                  />
                }
                title="You haven't created a gig"
                text="Create your first gig and start getting orders."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {gigs.map((gig) => (
                  <div
                    key={gig._id}
                    className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900"
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

                      <h3 className="line-clamp-2 text-lg font-medium">
                        {gig.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                        {gig.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">

                        <span className="font-semibold">
                          ₦
                          {Number(
                            gig.price || 0
                          ).toLocaleString()}
                        </span>

                        <div className="flex gap-2">

                          <Link
                            to={`/gigs/${gig._id}`}
                            title="View gig"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-700 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            to={`/edit-gig/${gig._id}`}
                            title="Edit gig"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-700 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                          >
                            <Pencil size={16} />
                          </Link>

                        </div>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

      </div>

      {/* ========================================
          REVIEW MODAL
      ======================================== */}

      {reviewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Leave a Review
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  How was your experience with{" "}
                  {reviewingOrder.freelancer
                    ?.name ||
                    "this freelancer"}
                  ?
                </p>

              </div>

              <button
                onClick={closeReview}
                disabled={reviewLoading}
                className="text-gray-500 transition hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            {/* STARS */}

            <div className="mt-6">

              <p className="mb-3 text-sm text-gray-400">
                Rating
              </p>

              <div className="flex gap-2">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewRating(star)
                      }
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={30}
                        fill={
                          star <=
                          reviewRating
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <=
                          reviewRating
                            ? "text-violet-500"
                            : "text-gray-600"
                        }
                      />
                    </button>
                  )
                )}

              </div>

            </div>

            {/* COMMENT */}

            <div className="mt-6">

              <label className="mb-2 block text-sm text-gray-400">
                Comment
              </label>

              <textarea
                value={reviewComment}
                onChange={(e) =>
                  setReviewComment(
                    e.target.value
                  )
                }
                rows={4}
                maxLength={1000}
                placeholder="Tell others about your experience..."
                className="w-full resize-none rounded-md border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
              />

              <p className="mt-1 text-right text-xs text-gray-600">
                {reviewComment.length}/1000
              </p>

            </div>

            {/* ERROR */}

            {reviewError && (
              <div className="mt-4 rounded-md border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
                {reviewError}
              </div>
            )}

            {/* ACTIONS */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={closeReview}
                disabled={reviewLoading}
                className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleReviewSubmit
                }
                disabled={
                  reviewLoading ||
                  !reviewRating
                }
                className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-5 py-2 text-sm font-medium transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewLoading ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star size={15} />
                    Submit Review
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

/*
========================================
STAT CARD
========================================
*/

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-violet-400">
          {icon}
        </div>

        <span className="text-2xl font-semibold">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm text-gray-500">
        {label}
      </p>

    </div>
  );
}

/*
========================================
STATUS BADGE
========================================
*/

function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "Pending",
      icon: <Clock size={13} />,
      className:
        "bg-yellow-500/10 text-yellow-400",
    },

    active: {
      label: "Active",
      icon: <Play size={13} />,
      className:
        "bg-blue-500/10 text-blue-400",
    },

    completed: {
      label: "Completed",
      icon: <Check size={13} />,
      className:
        "bg-green-500/10 text-green-400",
    },

    cancelled: {
      label: "Cancelled",
      icon: <X size={13} />,
      className:
        "bg-red-500/10 text-red-400",
    },
  };

  const current =
    config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${current.className}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
}

/*
========================================
EMPTY STATE
========================================
*/

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 py-16 text-center">

      <div className="flex justify-center text-gray-600">
        {icon}
      </div>

      <h3 className="mt-4 font-medium">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        {text}
      </p>

    </div>
  );
}

/*
========================================
INBOX ICON
========================================
*/

function InboxIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M4 13h4l2 3h4l2-3h4" />
    </svg>
  );
}

export default Dashboard;