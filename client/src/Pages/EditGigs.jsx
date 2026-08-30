import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  Tag,
  DollarSign,
  FileText,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function EditGig() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

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

        console.log("FETCHING GIG FOR EDIT:", id);

        const response = await api.get(`/gigs/${id}`);

        console.log("EDIT GIG RESPONSE:", response.data);

        const gig = response.data?.gig || response.data;

        if (!gig) {
          throw new Error("Gig not found");
        }

        setFormData({
          title: gig.title || "",
          description: gig.description || "",
          category: gig.category || "",
          price: gig.price ?? "",
          image: gig.image || "",
        });
      } catch (error) {
        console.error(
          "GET EDIT GIG ERROR:",
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
  HANDLE INPUT
  ========================================
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  ========================================
  UPDATE GIG
  ========================================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a gig title.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (!formData.category.trim()) {
      alert("Please enter a category.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      console.log("UPDATING GIG:", id);
      console.log("UPDATE DATA:", formData);

      const response = await api.put(`/gigs/${id}`, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
      });

      console.log("UPDATE RESPONSE:", response.data);

      alert("Gig updated successfully.");

      navigate(`/gigs/${id}`);
    } catch (error) {
      console.error(
        "UPDATE GIG ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update gig."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ========================================
  DELETE GIG
  ========================================
  */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gig? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      console.log("DELETING GIG:", id);

      const response = await api.delete(`/gigs/${id}`);

      console.log("DELETE RESPONSE:", response.data);

      alert("Gig deleted successfully.");

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "DELETE GIG ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete gig."
      );
    } finally {
      setDeleting(false);
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
        <div className="flex min-h-[70vh] items-center justify-center">
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

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div className="mt-10 rounded-xl border border-red-900 bg-red-950/30 p-10 text-center">
            <h1 className="text-xl font-semibold">
              Unable to load gig
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <Link
          to={`/gigs/${id}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to gig
        </Link>

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Edit gig
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your service information.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-800 bg-gray-900 p-6 md:p-8"
        >

          {/* TITLE */}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Gig title
            </label>

            <div className="relative">
              <FileText
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. I will build a modern React website"
                className="w-full rounded-md border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-violet-500"
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={7}
              placeholder="Describe what you are offering..."
              className="w-full resize-none rounded-md border border-gray-800 bg-gray-950 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-600 focus:border-violet-500"
            />
          </div>

          {/* CATEGORY + PRICE */}

          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            {/* CATEGORY */}

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Category
              </label>

              <div className="relative">
                <Tag
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Web Development"
                  className="w-full rounded-md border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                />
              </div>
            </div>

            {/* PRICE */}

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Price
              </label>

              <div className="relative">
                <DollarSign
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full rounded-md border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* IMAGE */}

          <div className="mt-6">
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md border border-gray-800 bg-gray-950 px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-violet-500"
            />

            <p className="mt-2 text-xs text-gray-600">
              Leave empty if you don't want an image.
            </p>
          </div>

          {/* IMAGE PREVIEW */}

          {formData.image && (
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-800 bg-gray-950">
              <img
                src={formData.image}
                alt="Gig preview"
                className="h-56 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* ACTIONS */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

            {/* DELETE */}

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-red-900/70 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Gig
                </>
              )}
            </button>

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving || deleting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-violet-600 px-6 py-3 text-sm font-medium transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </main>
  );
}

export default EditGig;