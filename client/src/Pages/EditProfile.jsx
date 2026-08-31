import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Save,
  Loader2,
  Image,
  FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../Services/api";
import { useAuth } from "../Context/AuthContext";


function EditProfile() {
  const navigate = useNavigate();

  const {
    user,
    authenticated,
    login,
    token,
  } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ========================================
  // LOAD CURRENT PROFILE
  // ========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response =
          await api.get("/users/profile");

        const currentUser =
          response.data.user;

        setName(currentUser.name || "");
        setBio(currentUser.bio || "");
        setProfileImage(
          currentUser.profileImage || ""
        );
      } catch (error) {
        console.error(
          "LOAD PROFILE ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (authenticated) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [authenticated]);


  // ========================================
  // SAVE PROFILE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);

      const response =
        await api.patch(
          "/users/profile",
          {
            name: name.trim(),
            bio: bio.trim(),
            profileImage:
              profileImage.trim(),
          }
        );

      const updatedUser =
        response.data.user;

      /*
        Update AuthContext/localStorage
        so Navbar immediately shows the
        new name/profile data.
      */

      login(
        updatedUser,
        token
      );

      setSuccess(
        "Profile updated successfully."
      );

      setTimeout(() => {
        navigate(
          `/users/${
            updatedUser._id ||
            updatedUser.id ||
            updatedUser.userId
          }`
        );
      }, 800);

    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };


  // ========================================
  // NOT AUTHENTICATED
  // ========================================

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="mx-auto max-w-xl px-6 py-20 text-center">

          <h1 className="text-2xl font-semibold">
            Login required
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You need to be logged in to edit
            your profile.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-md bg-violet-600 px-5 py-2.5 text-sm font-medium hover:bg-violet-700"
          >
            Login
          </Link>

        </div>
      </main>
    );
  }


  // ========================================
  // LOADING
  // ========================================

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


  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <Link
          to={`/users/${
            user?._id ||
            user?.id ||
            user?.userId
          }`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to profile
        </Link>


        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-semibold">
            Edit profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your public profile information.
          </p>

        </div>


        {/* FORM CARD */}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-800 bg-gray-900 p-6 md:p-8"
        >

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-md border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="mb-6 rounded-md border border-green-900 bg-green-950/30 p-4 text-sm text-green-400">
              {success}
            </div>
          )}


          {/* NAME */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <div className="relative">

              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your name"
                className="w-full rounded-md border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-600 focus:border-violet-500"
              />

            </div>

          </div>


          {/* BIO */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium">
              Bio
            </label>

            <div className="relative">

              <FileText
                size={17}
                className="absolute left-3 top-3 text-gray-500"
              />

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                placeholder="Tell people a little about yourself..."
                rows={5}
                className="w-full resize-none rounded-md border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 text-sm leading-6 outline-none placeholder:text-gray-600 focus:border-violet-500"
              />

            </div>

          </div>


          {/* PROFILE IMAGE */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium">
              Profile image URL
            </label>

            <div className="relative">

              <Image
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="url"
                value={profileImage}
                onChange={(e) =>
                  setProfileImage(
                    e.target.value
                  )
                }
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-md border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-600 focus:border-violet-500"
              />

            </div>

            <p className="mt-2 text-xs text-gray-600">
              Paste a publicly accessible image URL.
            </p>

          </div>


          {/* PREVIEW */}

          {profileImage && (
            <div className="mt-6">

              <p className="mb-2 text-sm font-medium">
                Preview
              </p>

              <img
                src={profileImage}
                alt="Profile preview"
                className="h-24 w-24 rounded-xl border border-gray-800 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>
          )}


          {/* BUTTONS */}

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-800 pt-6 sm:flex-row">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-violet-600 px-5 py-3 text-sm font-medium transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save changes
                </>
              )}

            </button>

            <Link
              to={`/users/${
                user?._id ||
                user?.id ||
                user?.userId
              }`}
              className="inline-flex items-center justify-center rounded-md border border-gray-800 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>

    </main>
  );
}

export default EditProfile;