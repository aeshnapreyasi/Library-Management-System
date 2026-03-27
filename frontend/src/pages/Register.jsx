import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    is_admin: false,
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Assuming we will create this route on the backend next
      await api.post("/auth/register", formData);
      setStatus({
        type: "success",
        message: "Registration successful! Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // FIX: Check if detail is a string or an object/array
      const errorData = err.response?.data?.detail;

      let errorMessage = "Registration failed.";

      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (Array.isArray(errorData)) {
        // FastAPI often returns a list of errors for 422
        errorMessage = errorData[0]?.msg || "Invalid input data.";
      } else if (typeof errorData === "object") {
        errorMessage = JSON.stringify(errorData);
      }

      setStatus({ type: "error", message: errorMessage });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Create Account
      </h2>

      {status.message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${status.type === "success" ? "bg-green-100 text-green-800 border border-green-400" : "bg-red-100 text-red-800 border border-red-400"}`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Desired Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="isAdmin"
            checked={formData.is_admin}
            onChange={(e) =>
              setFormData({ ...formData, is_admin: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="isAdmin"
            className="text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Register as System Admin (For testing purposes)
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition disabled:opacity-50 mt-2"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Login here
          </Link>
        </p>
        <Link
          to="/"
          className="inline-block mt-3 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:underline"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
