import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../Utils/axios";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post(`/login`, {
        email: email.trim(),
        password: password.trim(),
      });
      setUser(data.user);
      localStorage.setItem("token", data.token);
      toast.success("Logged in successfully");
      if (data.user?.role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      const errData = error?.response?.data;

      if (errData.errors && Array.isArray(errData.errors)) {
        toast.error(errData?.errors[0].message);
      } else if (errData?.message) {
        toast.error(errData.message);
      } else {
        toast.error("Login faild!Please Try again");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md shadow-lg p-6 rounded-lg bg-white border border-gray-200">
        <h1 className="text-center text-2xl font-bold">Welcome Back</h1>
        <p className="text-sm text-center text-gray-500 mt-1">
          Log in to continue to your account
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email:
            </label>

            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="w-full focus:outline-none focus:ring-1 focus:ring-[#22333B] rounded-md p-2 text-sm mt-1 border border-gray-300 to-gray-900 placeholder-gray-400"
              onChange={handleEmail}
            />
          </div>

          <div>
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              placeholder="password"
              className="w-full focus:outline-none focus:ring-1 focus:ring-[#22333B] rounded-md p-2 text-sm mt-1 border border-gray-300 to-gray-900 placeholder-gray-400"
              onChange={handlePassword}
            />
          </div>
          <button
            type="submit"
            className="w-full font-semibold mt-6 mb-4 flex justify-center items-center bg-blue-500 text-white py-2 rounded-md cursor-pointer hover:bg-blue-600 transition shadow-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center">
          <Link
            className="text-gray-500 hover:text-gray-700 text-sm hover:underline underline-offset-4"
            to="/register"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};
