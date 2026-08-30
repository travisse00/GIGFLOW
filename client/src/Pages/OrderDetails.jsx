import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  BriefcaseBusiness,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Loader2,
  Package,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function OrderDetails() {
  const { id } = useParams();
//   const navigate = useNavigate();

  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  /*
  ========================================
  FETCH ORDER
  ========================================
  */

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders/my-orders");

        const orders =
          response.data?.orders ||
          response.data ||
          [];

        const foundOrder = orders.find(
          (item) => item._id === id
        );

        if (!foundOrder) {
          setError("Order not found.");
          return;
        }

        setOrder(foundOrder);
      } catch (error) {
        console.error(
          "GET ORDER ERROR:",
          error.response?.data || error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  /*
  ========================================
  ORDER ACTION
  ========================================
  */

  const handleAction = async (action) => {
    if (!order?._id) return;

    try {
      setActionLoading(true);

      let endpoint = "";

      if (action === "accept") {
        endpoint = `/orders/${order._id}/accept`;
      }

      if (action === "decline") {
        endpoint = `/orders/${order._id}/decline`;
      }

      if (action === "complete") {
        endpoint = `/orders/${order._id}/complete`;
      }

      if (action === "cancel") {
        endpoint = `/orders/${order._id}/cancel`;
      }

      if (!endpoint) return;

      const response = await api.patch(endpoint);

      console.log(
        "ORDER ACTION RESPONSE:",
        response.data
      );

      setOrder(
        response.data?.order || order
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
      setActionLoading(false);
    }
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
  ERROR
  ========================================
  */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div className="mt-10 rounded-xl border border-red-900 bg-red-950/30 p-10 text-center">

            <Package
              size={35}
              className="mx-auto text-red-500"
            />

            <h1 className="mt-4 text-xl font-semibold">
              Order not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error ||
                "This order doesn't exist."}
            </p>

          </div>
        </div>
      </main>
    );
  }

  /*
  ========================================
  DATA
  ========================================
  */

  const gig = order.gig || {};
  const client = order.client || {};
  const freelancer = order.freelancer || {};

  const currentUserId =
    user?._id ||
    user?.id ||
    user?.userId;

  const clientId =
    client?._id?.toString() ||
    client?.toString();

  const freelancerId =
    freelancer?._id?.toString() ||
    freelancer?.toString();

  const isClient =
    currentUserId?.toString() === clientId;

  const isFreelancer =
    currentUserId?.toString() === freelancerId;

  /*
  ========================================
  STATUS
  ========================================
  */

  const statusConfig = {
    pending: {
      label: "Pending",
      className:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },

    active: {
      label: "Active",
      className:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },

    completed: {
      label: "Completed",
      className:
        "bg-green-500/10 text-green-400 border-green-500/20",
    },

    cancelled: {
      label: "Cancelled",
      className:
        "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };

  const status =
    statusConfig[order.status] ||
    statusConfig.pending;

  /*
  ========================================
  DATE
  ========================================
  */

  const createdDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(
        "en-NG",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Unknown";

  const createdTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString(
        "en-NG",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )
    : "";

  /*
  ========================================
  UI
  ========================================
  */

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        {/* BACK */}

        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Order
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              #{order._id}
            </h1>

          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium ${status.className}`}
          >
            {status.label}
          </span>

        </div>

        {/* MAIN GRID */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT */}

          <div className="space-y-6 lg:col-span-2">

            {/* GIG */}

            <section className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">

              {gig.image ? (
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center bg-gray-800 text-gray-600">
                  <BriefcaseBusiness size={40} />
                </div>
              )}

              <div className="p-6">

                <div className="flex flex-wrap items-center gap-2">

                  {gig.category && (
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                      {gig.category}
                    </span>
                  )}

                </div>

                <h2 className="mt-3 text-2xl font-semibold">
                  {gig.title || "Untitled Gig"}
                </h2>

                {gig.description && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-400">
                    {gig.description}
                  </p>
                )}

                <div className="mt-6 flex items-center gap-3 border-t border-gray-800 pt-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-800">
                    <DollarSign
                      size={19}
                      className="text-gray-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Order price
                    </p>

                    <p className="font-semibold">
                      ₦
                      {Number(
                        order.price || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* PEOPLE */}

            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <h2 className="text-lg font-semibold">
                People
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                {/* CLIENT */}

                <div className="rounded-lg border border-gray-800 bg-gray-950 p-5">

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Client
                  </p>

                  <div className="mt-4 flex items-center gap-3">

                    {client.profileImage ? (
                      <img
                        src={client.profileImage}
                        alt={client.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 text-gray-500">
                        <User size={19} />
                      </div>
                    )}

                    <div className="min-w-0">

                      <p className="truncate font-medium">
                        {client.name ||
                          "Unknown client"}
                      </p>

                      {client.email && (
                        <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
                          <Mail size={12} />
                          {client.email}
                        </p>
                      )}

                    </div>

                  </div>

                  {!isClient && client._id && (
                    <Link
                      to={`/users/${client._id}`}
                      className="mt-4 block text-sm text-violet-400 hover:text-violet-300"
                    >
                      View profile
                    </Link>
                  )}

                </div>

                {/* FREELANCER */}

                <div className="rounded-lg border border-gray-800 bg-gray-950 p-5">

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Freelancer
                  </p>

                  <div className="mt-4 flex items-center gap-3">

                    {freelancer.profileImage ? (
                      <img
                        src={freelancer.profileImage}
                        alt={freelancer.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 text-gray-500">
                        <User size={19} />
                      </div>
                    )}

                    <div className="min-w-0">

                      <p className="truncate font-medium">
                        {freelancer.name ||
                          "Unknown freelancer"}
                      </p>

                      {freelancer.email && (
                        <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
                          <Mail size={12} />
                          {freelancer.email}
                        </p>
                      )}

                    </div>

                  </div>

                  {!isFreelancer &&
                    freelancer._id && (
                      <Link
                        to={`/users/${freelancer._id}`}
                        className="mt-4 block text-sm text-violet-400 hover:text-violet-300"
                      >
                        View profile
                      </Link>
                    )}

                </div>

              </div>

            </section>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* ORDER INFO */}

            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <h2 className="text-lg font-semibold">
                Order information
              </h2>

              <div className="mt-5 space-y-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-400">
                    <Calendar size={17} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Created
                    </p>

                    <p className="text-sm">
                      {createdDate}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-400">
                    <Clock size={17} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Time
                    </p>

                    <p className="text-sm">
                      {createdTime}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-400">
                    <Package size={17} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <p className="text-sm capitalize">
                      {order.status}
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* ACTIONS */}

            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <h2 className="text-lg font-semibold">
                Actions
              </h2>

              <div className="mt-5 space-y-3">

                {/* FREELANCER */}

                {isFreelancer &&
                  order.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleAction("accept")
                        }
                        disabled={actionLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-3 text-sm font-medium transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <CheckCircle size={17} />
                        )}

                        Accept Order
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleAction("decline")
                        }
                        disabled={actionLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-red-900 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={17} />
                        Decline Order
                      </button>
                    </>
                  )}

                {isFreelancer &&
                  order.status === "active" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAction("complete")
                      }
                      disabled={actionLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-3 text-sm font-medium transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <CheckCircle size={17} />
                      )}

                      Complete Order
                    </button>
                  )}

                {/* CLIENT */}

                {isClient &&
                  order.status !== "completed" &&
                  order.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAction("cancel")
                      }
                      disabled={actionLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-red-900 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Ban size={17} />
                      )}

                      Cancel Order
                    </button>
                  )}

                {/* NO ACTION */}

                {((isFreelancer &&
                  order.status === "completed") ||
                  (isFreelancer &&
                    order.status === "cancelled") ||
                  (isClient &&
                    (order.status === "completed" ||
                      order.status === "cancelled"))) && (
                  <div className="rounded-md border border-gray-800 bg-gray-950 p-4 text-center text-sm text-gray-500">
                    No actions available for this order.
                  </div>
                )}

              </div>

            </section>

          </div>

        </div>

      </div>

    </main>
  );
}

export default OrderDetails;