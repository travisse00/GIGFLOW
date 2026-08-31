import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  BriefcaseBusiness,
  User,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../Services/api";

function Gigs() {
  const [gigs, setGigs] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH GIGS
  // =====================================================

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/gigs");

        const data = response.data;

        if (Array.isArray(data)) {
          setGigs(data);
        } else if (Array.isArray(data.gigs)) {
          setGigs(data.gigs);
        } else {
          setGigs([]);
        }
      } catch (error) {
        console.error("FETCH GIGS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load gigs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        gigs
          .map((gig) => gig.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort();
  }, [gigs]);

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredGigs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    let result = gigs.filter((gig) => {
      const matchesSearch =
        !searchTerm ||
        gig.title
          ?.toLowerCase()
          .includes(searchTerm) ||
        gig.description
          ?.toLowerCase()
          .includes(searchTerm) ||
        gig.category
          ?.toLowerCase()
          .includes(searchTerm);

      const matchesCategory =
        category === "all" ||
        gig.category === category;

      return matchesSearch && matchesCategory;
    });

    // ===================================================
    // SORT
    // ===================================================

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
      );
    }

    return result;
  }, [gigs, search, category, sort]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("newest");
  };

  const hasFilters =
    search.trim() !== "" ||
    category !== "all" ||
    sort !== "newest";

  // =====================================================
  // LOADING SKELETON
  // =====================================================

  const loadingCards = Array.from(
    { length: 6 },
    (_, index) => index
  );

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">

              <BriefcaseBusiness className="h-5 w-5 text-violet-400" />

            </div>

            <div>

              <h1 className="text-3xl font-semibold tracking-tight">
                Explore gigs
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Find talented freelancers for your next
                project.
              </p>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* SEARCH BAR */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-3 lg:flex-row">

          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search gigs, services or skills..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-10 text-sm outline-none placeholder:text-gray-600 transition focus:border-violet-500"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
              >
                <X size={17} />
              </button>
            )}

          </div>

          {/* FILTER BUTTON */}

          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className={`flex items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm transition ${
              showFilters ||
              category !== "all"
                ? "border-violet-500 bg-violet-500/10 text-violet-400"
                : "border-gray-800 bg-gray-900 hover:bg-gray-800"
            }`}
          >

            <SlidersHorizontal size={17} />

            Filters

            {category !== "all" && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-xs text-white">
                1
              </span>
            )}

          </button>

          {/* SORT */}

          <div className="relative">

            <ArrowUpDown
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="w-full appearance-none rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-violet-500 lg:w-52"
            >

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

            </select>

          </div>

        </div>

        {/* ================================================= */}
        {/* FILTER PANEL */}
        {/* ================================================= */}

        {showFilters && (
          <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-5">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

              <div className="flex-1">

                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-3 text-sm outline-none focus:border-violet-500"
                >

                  <option value="all">
                    All categories
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-2 rounded-md border border-gray-800 px-4 py-3 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >

                  <X size={16} />

                  Clear filters

                </button>
              )}

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* RESULT COUNT */}
        {/* ================================================= */}

        {!loading && !error && (
          <div className="mb-5 flex items-center justify-between">

            <p className="text-sm text-gray-500">

              {filteredGigs.length}{" "}
              {filteredGigs.length === 1
                ? "gig"
                : "gigs"}{" "}
              found

            </p>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                Clear filters
              </button>
            )}

          </div>
        )}

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {loadingCards.map((item) => (

              <div
                key={item}
                className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900"
              >

                <div className="h-44 animate-pulse bg-gray-800" />

                <div className="space-y-4 p-5">

                  <div className="h-3 w-24 animate-pulse rounded bg-gray-800" />

                  <div className="h-5 w-4/5 animate-pulse rounded bg-gray-800" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-800" />

                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-800" />

                  <div className="border-t border-gray-800 pt-4">

                    <div className="h-9 animate-pulse rounded bg-gray-800" />

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading && error && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-5">

            <p className="text-sm text-red-400">
              {error}
            </p>

          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          filteredGigs.length === 0 && (
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-6 py-20 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">

                <Search className="h-5 w-5 text-gray-600" />

              </div>

              <h2 className="mt-5 text-lg font-medium">
                No gigs found
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                We couldn't find any gigs matching
                your search. Try another keyword or
                clear your filters.
              </p>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-md bg-violet-600 px-5 py-2.5 text-sm font-medium transition hover:bg-violet-700"
                >
                  Clear filters
                </button>
              )}

            </div>
          )}

        {/* ================================================= */}
        {/* GIG GRID */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          filteredGigs.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {filteredGigs.map((gig) => (

                <Link
                  key={gig._id}
                  to={`/gigs/${gig._id}`}
                  className="group overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition hover:-translate-y-1 hover:border-gray-700"
                >

                  {/* IMAGE */}

                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gray-800">

                    {gig.image ? (

                      <img
                        src={gig.image}
                        alt={gig.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                    ) : (

                      <BriefcaseBusiness className="h-10 w-10 text-gray-700" />

                    )}

                    {gig.category && (
                      <span className="absolute left-3 top-3 rounded-full border border-gray-700 bg-gray-950/80 px-2.5 py-1 text-xs text-violet-400 backdrop-blur">
                        {gig.category}
                      </span>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    {/* FREELANCER */}

                    <div className="mb-3 flex items-center gap-2">

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800">

                        <User
                          size={13}
                          className="text-gray-500"
                        />

                      </div>

                      <span className="text-xs text-gray-500">

                        {gig.freelancer?.name ||
                          gig.freelancer?.username ||
                          "Freelancer"}

                      </span>

                    </div>

                    {/* TITLE */}

                    <h2 className="line-clamp-2 text-lg font-medium transition group-hover:text-violet-400">
                      {gig.title}
                    </h2>

                    {/* DESCRIPTION */}

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                      {gig.description}
                    </p>

                    {/* BOTTOM */}

                    <div className="mt-5 flex items-end justify-between border-t border-gray-800 pt-4">

                      <div>

                        <p className="text-xs text-gray-500">
                          Starting at
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          <DollarSign size={18} className="inline-block" />
                          {Number(
                            gig.price || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                      <span className="flex items-center gap-1 text-sm text-violet-400 transition group-hover:text-violet-300">

                        View Gig

                        <ArrowUpDown
                          size={14}
                          className="rotate-90"
                        />

                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>
          )}

      </div>
    </main>
  );
}

export default Gigs;