import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Briefcase,
  FileText,
  DollarSign,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const gigSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters")
    .required("Title is required"),

  description: Yup.string()
    .min(20, "Description must be at least 20 characters")
    .required("Description is required"),

  category: Yup.string()
    .required("Category is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),

  deliveryTime: Yup.number()
    .typeError("Delivery time must be a number")
    .integer("Delivery time must be a whole number")
    .positive("Delivery time must be greater than 0")
    .required("Delivery time is required")
});

function CreateGig() {
  const navigate = useNavigate();

  const handleSubmit = async (
    values,
    { setSubmitting, setStatus }
  ) => {
    try {
      setStatus("");

      await api.post("/gigs", values);

      navigate("/gigs");
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          "Failed to create gig."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create a gig
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Tell clients what you can do for them.
          </p>
        </div>

        <Formik
          initialValues={{
            title: "",
            description: "",
            category: "",
            price: "",
            deliveryTime: ""
          }}
          validationSchema={gigSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-6">

              {/* Error */}
              {status && (
                <div className="rounded-md border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                  {status}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Gig title
                </label>

                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <Field
                    name="title"
                    placeholder="I will build a modern React website"
                    className="w-full rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>

                <ErrorMessage
                  name="title"
                  component="p"
                  className="mt-1 text-xs text-red-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-3 top-4 text-gray-500"
                  />

                  <Field
                    as="textarea"
                    name="description"
                    rows="6"
                    placeholder="Describe what you offer..."
                    className="w-full resize-none rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>

                <ErrorMessage
                  name="description"
                  component="p"
                  className="mt-1 text-xs text-red-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <Field
                  as="select"
                  name="category"
                  className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-3 text-sm outline-none focus:border-violet-500"
                >
                  <option value="">
                    Select a category
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="Mobile Development">
                    Mobile Development
                  </option>

                  <option value="UI/UX Design">
                    UI/UX Design
                  </option>

                  <option value="Graphic Design">
                    Graphic Design
                  </option>

                  <option value="Writing">
                    Writing
                  </option>

                  <option value="Marketing">
                    Marketing
                  </option>
                </Field>

                <ErrorMessage
                  name="category"
                  component="p"
                  className="mt-1 text-xs text-red-400"
                />
              </div>

              {/* Price + Delivery */}
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Starting price
                  </label>

                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <Field
                      name="price"
                      type="number"
                      placeholder="50000"
                      className="w-full rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-600 focus:border-violet-500"
                    />
                  </div>

                  <ErrorMessage
                    name="price"
                    component="p"
                    className="mt-1 text-xs text-red-400"
                  />
                </div>

                {/* Delivery */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Delivery time
                  </label>

                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <Field
                      name="deliveryTime"
                      type="number"
                      placeholder="7"
                      className="w-full rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-600 focus:border-violet-500"
                    />
                  </div>

                  <ErrorMessage
                    name="deliveryTime"
                    component="p"
                    className="mt-1 text-xs text-red-400"
                  />
                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-violet-600 py-3 text-sm font-medium transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Publishing..."
                  : "Publish Gig"}
              </button>

            </Form>
          )}
        </Formik>

      </div>
    </main>
  );
}

export default CreateGig;