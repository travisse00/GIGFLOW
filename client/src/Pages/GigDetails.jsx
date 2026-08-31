import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Tag,
  DollarSign,
  Loader2,
  BriefcaseBusiness,
  Mail,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../Services/api";
import { useAuth } from "../Context/AuthContext";

function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, authenticated } = useAuth();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hireLoading, setHireLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  ========================================
  GET GIG
  ========================================
  */

  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/gigs/${id}`);

        console.log("GIG RESPONSE:", response.data);

        setGig(response.data?.gig || response.data);
      } catch (error) {
        console.error(
          "GET GIG ERROR:",
          error.response?.data || error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load gig."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGig();
    }
  }, [id]);

  /*
  ========================================
  USER / FREELANCER
  ========================================
  */

  const freelancer = gig?.freelancer;

  const freelancerId =
    freelancer?._id?.toString() ||
    freelancer?.toString();

  const userId =
    user?._id?.toString() ||
    user?.id?.toString() ||
    user?.userId?.toString();

  const isOwner =
    freelancerId &&
    userId &&
    freelancerId === userId;

  /*
  ========================================
  HIRE
  ========================================
  */

  const handleHire = async () => {
    setError("");
    setSuccess("");

    if (!authenticated || !user) {
      navigate("/login");
      return;
    }

    if (!gig?._id) {
      setError("Gig not found.");
      return;
    }

    if (isOwner) {
      setError("You cannot hire yourself.");
      return;
    }

    try {
      setHireLoading(true);

      console.log("HIRING GIG:", gig._id);

      const response = await api.post("/orders", {
        gigId: gig._id,
      });

      console.log(
        "CREATE ORDER RESPONSE:",
        response.data
      );

      setSuccess(
        "Order created successfully. Redirecting to your dashboard..."
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      console.error(
        "HIRE ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create order."
      );
    } finally {
      setHireLoading(false);
    }
  };

  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={30}
              className="animate-spin text-violet-500"
            />

            <p className="text-sm text-gray-500">
              Loading gig...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  ========================================
  ERROR / NOT FOUND
  ========================================
  */

  if (error && !gig) {
    return (
      <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/gigs"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to gigs
          </Link>

          <div className="mt-10 rounded-xl border border-red-900/60 bg-red-950/20 p-10 text-center">
            <h1 className="text-xl font-semibold">
              Gig not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!gig) {
    return null;
  }

  /*
  ========================================
  FREELANCER DATA
  ========================================
  */

  const freelancerName =
    freelancer?.name ||
    freelancer?.username ||
    "Freelancer";

  const freelancerEmail =
    freelancer?.email || "";

  const freelancerImage =
    freelancer?.profileImage ||
    freelancer?.image ||
    null;

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

        {/* GRID */}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ========================================
              MAIN GIG
          ======================================== */}

          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">

            {/* IMAGE */}

            {gig.image ? (
              <img
                src={gig.image}
                alt={gig.title}
                className="h-72 w-full object-cover md:h-96"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-gray-800 md:h-96">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-900 text-gray-600">
                  <BriefcaseBusiness size={36} />
                </div>
              </div>
            )}

            <div className="p-6 md:p-8">

              {/* CATEGORY */}

              {gig.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400">
                    <Tag size={13} />
                    {gig.category}
                  </span>
                </div>
              )}

              {/* TITLE */}

              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                {gig.title}
              </h1>

              {/* DESCRIPTION */}

              <div className="mt-7">
                <h2 className="text-sm font-semibold text-white">
                  About this gig
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-400">
                  {gig.description}
                </p>
              </div>

              {/* GIG INFO */}

              <div className="mt-8 grid gap-4 border-y border-gray-800 py-6 sm:grid-cols-2">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-800 text-gray-400">
                    <DollarSign size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Starting price
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      <DollarSign size={14} className="inline-block" />
                      {Number(
                        gig.price || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-800 text-gray-400">
                    <Tag size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Category
                    </p>

                    <p className="mt-1 font-medium">
                      {gig.category || "General"}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ========================================
              SIDEBAR
          ======================================== */}

          <aside className="h-fit space-y-5 lg:sticky lg:top-6">

            {/* FREELANCER CARD */}

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                About the freelancer
              </p>

              <div className="mt-5 flex items-center gap-4">

                {freelancerImage ? (
                  <img
                    src={freelancerImage}
                    alt={freelancerName}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-gray-400">
                    <User size={24} />
                  </div>
                )}

                <div className="min-w-0">
                  <Link
  to={`/users/${freelancer?._id || freelancer}`}
  className="font-semibold text-white transition hover:text-violet-400"
>
  {freelancerName}
</Link>

                  {freelancerEmail && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <Mail size={13} />
                      <span className="truncate">
                        {freelancerEmail}
                      </span>
                    </div>
                  )}
                </div>

              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-gray-800 pt-5 text-xs text-gray-500">
                <ShieldCheck
                  size={15}
                  className="text-violet-400"
                />

                Verified freelancer
              </div>

            </div>

            {/* ORDER CARD */}

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Starting at
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    <DollarSign size={14} className="inline-block" />
                    {Number(
                      gig.price || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <DollarSign
                  size={22}
                  className="text-violet-400"
                />

              </div>

              {/* SUCCESS */}

              {success && (
                <div className="mt-5 flex gap-2 rounded-lg border border-green-900/60 bg-green-950/20 p-3 text-sm text-green-400">
                  <CheckCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{success}</span>
                </div>
              )}

              {/* ERROR */}

              {error && gig && (
                <div className="mt-5 rounded-lg border border-red-900/60 bg-red-950/20 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* OWNER */}

              {isOwner ? (
                <div className="mt-5 rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-center text-sm text-gray-500">
                  This is your gig.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleHire}
                  disabled={hireLoading}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {hireLoading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Creating order...
                    </>
                  ) : (
                    <>
                      Hire Freelancer
                    </>
                  )}
                </button>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-gray-600">
                You won't be charged until the order is
                successfully created.
              </p>

            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}

export default GigDetails;
