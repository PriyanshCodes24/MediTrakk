import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const { data } = await axios.post(`${API}/login`, {
        email: email.trim(),
        password: password.trim(),
      });
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
      // <Navigate to="/dashboard" />;
    } catch (error) {
      console.log("Login failed:", error);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-400">
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
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
