import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Eye,
  EyeOff
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../Context/AuthContext";

const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  role: Yup.string()
    .oneOf(
      ["client", "freelancer"],
      "Invalid account type"
    )
    .required("Please select an account type")
});

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values,
    { setSubmitting, setStatus }
  ) => {
    try {
      setStatus("");

      const response = await api.post(
        "/auth/register",
        values
      );

      login(
        response.data.user,
        response.data.token
      );

      navigate("/");
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Join GigFlow and get started today.
          </p>
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            role: "client"
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-5">

              {/* Server Error */}
              {status && (
                <div className="rounded-md border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                  {status}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <Field
                    name="name"
                    placeholder="John Doe"
                    className="w-full rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>

                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-xs text-red-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <Field
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>

                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-red-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-12 text-sm outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-xs text-red-400"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Account type
                </label>

                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <Field
                    as="select"
                    name="role"
                    className="w-full appearance-none rounded-md border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500"
                  >
                    <option value="client">
                      I want to hire freelancers
                    </option>

                    <option value="freelancer">
                      I want to offer services
                    </option>
                  </Field>
                </div>

                <ErrorMessage
                  name="role"
                  component="p"
                  className="mt-1 text-xs text-red-400"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-violet-600 py-3 text-sm font-medium transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </Form>
          )}
        </Formik>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-medium text-violet-400 transition hover:text-violet-300"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;