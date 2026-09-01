import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../Context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { user, authenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const userId =
    user?._id ||
    user?.id ||
    user?.userId;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ========================================
            TOP NAVBAR
        ======================================== */}

        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}

          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-bold tracking-tight"
          >
            Gig<span className="text-violet-500">Flow</span>
          </Link>

          {/* ========================================
              DESKTOP NAVIGATION
          ======================================== */}

          <div className="hidden items-center gap-6 md:flex">

            <Link
              to="/gigs"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Explore
            </Link>

            {authenticated ? (
              <>
                {user.role === "freelancer" && (
                  <Link
                  to="/create-gig"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Create Gig
                </Link>)}

                <Link
                  to="/dashboard"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Dashboard
                </Link>

                <NotificationBell />

                <div className="flex items-center gap-3 border-l border-gray-800 pl-5">

                  {/* PROFILE */}

                  {userId ? (
                    <Link
                      to={`/users/${userId}`}
                      className="flex items-center gap-2 transition hover:text-violet-400"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600">
                        <User size={16} />
                      </div>

                      <span className="max-w-32 truncate">
                        {user?.name || "Profile"}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600">
                        <User size={16} />
                      </div>

                      <span className="text-gray-400">
                        {user?.name || "Profile"}
                      </span>
                    </div>
                  )}

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={logout}
                    title="Logout"
                    className="text-gray-400 transition hover:text-red-400"
                  >
                    <LogOut size={18} />
                  </button>

                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-700"
                >
                  Join GigFlow
                </Link>
              </>
            )}

          </div>

          {/* ========================================
              MOBILE CONTROLS
          ======================================== */}

          <div className="flex items-center gap-3 md:hidden">

            {authenticated && <NotificationBell />}

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-800 text-gray-300 transition hover:bg-gray-900 hover:text-white"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

          </div>

        </div>

        {/* ========================================
            MOBILE MENU
        ======================================== */}

        {menuOpen && (
          <div className="border-t border-gray-800 py-4 md:hidden">

            <div className="flex flex-col gap-1">

              {/* EXPLORE */}

              <Link
                to="/gigs"
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm text-gray-300 transition hover:bg-gray-900 hover:text-white"
              >
                Explore
              </Link>

              {authenticated ? (
                <>
                  {/* CREATE GIG */}

                  <Link
                    to="/create-gig"
                    onClick={closeMenu}
                    className="rounded-md px-3 py-3 text-sm text-gray-300 transition hover:bg-gray-900 hover:text-white"
                  >
                    Create Gig
                  </Link>

                  {/* DASHBOARD */}

                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="rounded-md px-3 py-3 text-sm text-gray-300 transition hover:bg-gray-900 hover:text-white"
                  >
                    Dashboard
                  </Link>

                  {/* PROFILE */}

                  {userId && (
                    <Link
                      to={`/users/${userId}`}
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-gray-300 transition hover:bg-gray-900 hover:text-white"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600">
                        <User size={16} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white">
                          {user?.name || "Profile"}
                        </span>

                        <span className="text-xs text-gray-500">
                          View profile
                        </span>
                      </div>
                    </Link>
                  )}

                  {/* DIVIDER */}

                  <div className="my-2 border-t border-gray-800" />

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-gray-400 transition hover:bg-red-950/30 hover:text-red-400"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* LOGIN */}

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-md px-3 py-3 text-sm text-gray-300 transition hover:bg-gray-900 hover:text-white"
                  >
                    Login
                  </Link>

                  {/* REGISTER */}

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-2 rounded-md bg-violet-600 px-4 py-3 text-center text-sm font-medium transition hover:bg-violet-700"
                  >
                    Join GigFlow
                  </Link>
                </>
              )}

            </div>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
