import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Palette,
  Megaphone,
  PenTool,
  Video,
  Building2,
  ShieldCheck,
  Zap,
  Users,
  CircleCheck,
  TrendingUp,
  Search,
  ShoppingCart,
} from "lucide-react";

function Home() {
  const [gigs, setGigs] = useState([]);

  const [stats, setStats] = useState({
    freelancers: 0,
    gigs: 0,
    completedOrders: 0,
    totalOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH HOME DATA
  // =========================

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [gigsResponse, statsResponse] =
          await Promise.all([
            axios.get("http://localhost:5000/api/gigs"),
            axios.get("http://localhost:5000/api/stats"),
          ]);

        // =========================
        // GIGS
        // =========================

        const gigData = gigsResponse.data;

        if (Array.isArray(gigData)) {
          setGigs(gigData);
        } else if (Array.isArray(gigData.gigs)) {
          setGigs(gigData.gigs);
        } else {
          setGigs([]);
        }

        // =========================
        // STATS
        // =========================

        if (statsResponse.data) {
          setStats({
            freelancers:
              statsResponse.data.freelancers || 0,

            gigs:
              statsResponse.data.gigs || 0,

            completedOrders:
              statsResponse.data.completedOrders || 0,

            totalOrders:
              statsResponse.data.totalOrders || 0,
          });
        }
      } catch (error) {
        console.error(
          "FETCH HOME DATA ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    {
      name: "Web Development",
      description:
        "Websites, apps and frontend development",
      icon: Code2,
    },
    {
      name: "Graphic Design",
      description:
        "Logos, branding and visual designs",
      icon: Palette,
    },
    {
      name: "Digital Marketing",
      description:
        "Social media, SEO and marketing",
      icon: Megaphone,
    },
    {
      name: "Writing",
      description:
        "Articles, copywriting and content",
      icon: PenTool,
    },
    {
      name: "Video & Animation",
      description:
        "Video editing, animation and motion",
      icon: Video,
    },
    {
      name: "Business",
      description:
        "Business support and consulting",
      icon: Building2,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="border-b border-gray-900">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">

          {/* LEFT */}

          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400">

              <BriefcaseBusiness className="h-3.5 w-3.5" />

              Freelance marketplace

            </div>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-6xl">

              Find the right talent.

              <br />

              <span className="text-violet-500">
                Get work done.
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              Connect with skilled freelancers, hire the
              right people for your project, and get quality
              work done without the hassle.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                to="/gigs"
                className="group inline-flex items-center gap-2 rounded-md bg-violet-600 px-6 py-3 text-sm font-medium transition hover:bg-violet-700"
              >
                Find a Freelancer

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-6 py-3 text-sm font-medium transition hover:border-gray-600 hover:bg-gray-900"
              >
                Become a Freelancer
              </Link>

            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-gray-500">

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-violet-400" />
                Secure marketplace
              </div>

              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-400" />
                Real-time updates
              </div>

            </div>

          </div>

          {/* RIGHT HERO CARD */}

          <div className="hidden md:block">

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Popular service
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    Web Development
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-400">

                  <CircleCheck className="h-3.5 w-3.5" />

                  Top rated

                </div>

              </div>

              <div className="rounded-xl bg-gray-950 p-5">

                <div className="mb-5 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-violet-900/40 to-gray-900">

                  <Code2 className="h-12 w-12 text-violet-500/50" />

                </div>

                <p className="text-sm text-gray-500">
                  Professional freelancer
                </p>

                <h3 className="mt-1 text-lg font-medium">
                  Modern React Website
                </h3>

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-sm text-yellow-400">
                    ★ 4.9
                  </span>

                  <span className="text-lg font-semibold">
                    $150
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* REAL PLATFORM STATS */}
      {/* ================================================= */}

      <section className="border-b border-gray-900">

        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-gray-800 md:grid-cols-4">

          {/* FREELANCERS */}

          <div className="px-6 py-8 text-center">

            <Users className="mx-auto mb-3 h-5 w-5 text-violet-400" />

            <p className="text-2xl font-semibold">
              {stats.freelancers}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Freelancers
            </p>

          </div>

          {/* GIGS */}

          <div className="px-6 py-8 text-center">

            <BriefcaseBusiness className="mx-auto mb-3 h-5 w-5 text-violet-400" />

            <p className="text-2xl font-semibold">
              {stats.gigs}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Gigs
            </p>

          </div>

          {/* COMPLETED ORDERS */}

          <div className="px-6 py-8 text-center">

            <CircleCheck className="mx-auto mb-3 h-5 w-5 text-violet-400" />

            <p className="text-2xl font-semibold">
              {stats.completedOrders}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Orders completed
            </p>

          </div>

          {/* TOTAL ORDERS */}

          <div className="px-6 py-8 text-center">

            <ShoppingCart className="mx-auto mb-3 h-5 w-5 text-violet-400" />

            <p className="text-2xl font-semibold">
              {stats.totalOrders}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Total orders
            </p>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* CATEGORIES */}
      {/* ================================================= */}

      <section className="mx-auto max-w-6xl px-6 py-20">

        <div className="mb-10">

          <p className="text-sm font-medium text-violet-400">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-semibold">
            Browse by category
          </h2>

          <p className="mt-3 text-gray-400">
            Find freelancers who specialize in exactly
            what you need.
          </p>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => {

            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                to={`/gigs?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group rounded-xl border border-gray-800 bg-gray-900 p-6 transition hover:-translate-y-1 hover:border-violet-500/50"
              >

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-violet-500/10">

                  <Icon className="h-5 w-5 text-violet-400" />

                </div>

                <h3 className="font-medium">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm text-violet-400">

                  Explore

                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />

                </div>

              </Link>
            );
          })}

        </div>

      </section>

      {/* ================================================= */}
      {/* FEATURED GIGS */}
      {/* ================================================= */}

      <section className="border-y border-gray-900 bg-gray-900/30">

        <div className="mx-auto max-w-6xl px-6 py-20">

          <div className="mb-10 flex items-end justify-between gap-4">

            <div>

              <p className="text-sm font-medium text-violet-400">
                Marketplace
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                Featured gigs
              </h2>

              <p className="mt-3 text-gray-400">
                Discover services from freelancers on
                GigFlow.
              </p>

            </div>

            <Link
              to="/gigs"
              className="hidden items-center gap-1 text-sm text-violet-400 hover:text-violet-300 sm:flex"
            >

              View all

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="h-80 animate-pulse rounded-xl border border-gray-800 bg-gray-900"
                />

              ))}

            </div>

          ) : gigs.length === 0 ? (

            /* EMPTY STATE */

            <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-12 text-center">

              <BriefcaseBusiness className="mx-auto h-8 w-8 text-gray-600" />

              <p className="mt-4 text-gray-400">
                No gigs available yet.
              </p>

              <Link
                to="/register"
                className="mt-4 inline-flex items-center gap-1 text-sm text-violet-400"
              >

                Create the first gig

                <ArrowRight className="h-4 w-4" />

              </Link>

            </div>

          ) : (

            /* GIGS */

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {gigs.slice(0, 6).map((gig) => (

                <Link
                  key={gig._id}
                  to={`/gigs/${gig._id}`}
                  className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition hover:-translate-y-1 hover:border-gray-700"
                >

                  {/* IMAGE */}

                  <div className="h-44 overflow-hidden bg-gray-800">

                    {gig.image ? (

                      <img
                        src={gig.image}
                        alt={gig.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-900/30 to-gray-900">

                        <Code2 className="h-10 w-10 text-violet-500/30" />

                      </div>

                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    <div className="mb-3 flex items-center justify-between">

                      <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs text-violet-400">
                        {gig.category}
                      </span>

                      {gig.rating && (

                        <span className="text-xs text-yellow-400">
                          ★ {gig.rating}
                        </span>

                      )}

                    </div>

                    <h3 className="line-clamp-2 font-medium leading-6 transition group-hover:text-violet-400">
                      {gig.title}
                    </h3>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-800 pt-4">

                      <span className="text-xs text-gray-500">
                        Starting at
                      </span>

                      <span className="font-semibold">
                        ${gig.price}
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

          <Link
            to="/gigs"
            className="mt-8 flex items-center justify-center gap-1 text-sm text-violet-400 sm:hidden"
          >

            View all gigs

            <ArrowRight className="h-4 w-4" />

          </Link>

        </div>

      </section>

      {/* ================================================= */}
      {/* HOW IT WORKS */}
      {/* ================================================= */}

      <section className="mx-auto max-w-6xl px-6 py-20">

        <div className="mb-12 text-center">

          <p className="text-sm font-medium text-violet-400">
            Simple process
          </p>

          <h2 className="mt-2 text-3xl font-semibold">
            How GigFlow works
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Getting work done shouldn't be complicated.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          <div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">

              <Search className="h-5 w-5 text-violet-400" />

            </div>

            <p className="mt-6 text-xs font-medium text-gray-600">
              STEP 01
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Find a service
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Browse gigs and find a freelancer who has
              the skills your project needs.
            </p>

          </div>

          <div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">

              <ShoppingCart className="h-5 w-5 text-violet-400" />

            </div>

            <p className="mt-6 text-xs font-medium text-gray-600">
              STEP 02
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Place an order
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Choose the service you want and send an order
              directly to the freelancer.
            </p>

          </div>

          <div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">

              <CircleCheck className="h-5 w-5 text-violet-400" />

            </div>

            <p className="mt-6 text-xs font-medium text-gray-600">
              STEP 03
            </p>

            <h3 className="mt-2 text-lg font-semibold">
              Get it done
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Track your order from pending to active and
              finally completed.
            </p>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* WHY GIGFLOW */}
      {/* ================================================= */}

      <section className="border-y border-gray-900 bg-gray-900/30">

        <div className="mx-auto max-w-6xl px-6 py-20">

          <div className="mb-10">

            <p className="text-sm font-medium text-violet-400">
              Why GigFlow
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              Built to make freelancing easier
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <ShieldCheck className="h-6 w-6 text-violet-400" />

              <h3 className="mt-5 font-medium">
                Secure marketplace
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Protected accounts and controlled order
                access keep transactions organized.
              </p>

            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <Zap className="h-6 w-6 text-violet-400" />

              <h3 className="mt-5 font-medium">
                Real-time updates
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Socket-powered updates keep clients and
                freelancers synchronized.
              </p>

            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <Users className="h-6 w-6 text-violet-400" />

              <h3 className="mt-5 font-medium">
                Skilled freelancers
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Discover people offering services across
                different categories.
              </p>

            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <TrendingUp className="h-6 w-6 text-violet-400" />

              <h3 className="mt-5 font-medium">
                Grow your business
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Turn your skills into services and start
                receiving orders.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* FINAL CTA */}
      {/* ================================================= */}

      <section className="mx-auto max-w-6xl px-6 py-24">

        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-500/5 px-6 py-16 text-center">

          <div className="absolute left-8 top-8 opacity-10">
            <BriefcaseBusiness className="h-24 w-24" />
          </div>

          <div className="absolute bottom-8 right-8 opacity-10">
            <TrendingUp className="h-24 w-24" />
          </div>

          <div className="relative">

            <p className="text-sm font-medium text-violet-400">
              Get started today
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Ready to get things done?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Find the right freelancer for your project or
              start selling your own services on GigFlow.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <Link
                to="/gigs"
                className="group inline-flex items-center gap-2 rounded-md bg-violet-600 px-6 py-3 text-sm font-medium transition hover:bg-violet-700"
              >

                Find a Freelancer

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />

              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-6 py-3 text-sm font-medium transition hover:bg-gray-900"
              >
                Start Selling
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
