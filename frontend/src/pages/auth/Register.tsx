import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API}/register`, {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      setUser(data.user);
      localStorage.setItem("token", data.token);
      console.log("Register Response:", data);
      toast.success("Signed up successfully");
      navigate("/dashboard");
    } catch (e: any) {
      console.log(e);

      const errData = e?.response?.data;
      if (errData.errors && Array.isArray(errData.errors)) {
        toast.error(errData?.errors[0]?.message);
      } else if (errData.message) {
        toast.error(errData?.message);
      } else {
        toast.error("Register failed");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-center text-xl font-bold mb-4">
          Sign Up as Patient
        </h1>
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="full name"
            className="border rounded-lg px-3 py-2 w-full"
            onChange={handleName}
          />
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
