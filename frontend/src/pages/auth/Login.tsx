import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

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
      const { data } = await axios.post(`${API}/login`, {
        email: email.trim(),
        password: password.trim(),
      });
      setUser(data.user);
      localStorage.setItem("token", data.token);
      toast.success("Logged in successfully");
      if (data.user?.role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (error: any) {
      console.log(error);
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
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-center text-xl font-bold mb-4">Welcome Back</h1>

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="border rounded-lg px-3 py-2 w-full"
            onChange={handleEmail}
          />
          <input
            type="password"
            placeholder="password"
            className="border rounded-lg px-3 py-2 w-full"
            onChange={handlePassword}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
