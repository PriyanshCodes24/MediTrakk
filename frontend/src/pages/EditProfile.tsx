import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email both are Required ");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `${API}/users/update`,
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(data.user);
      toast.success("Profile updated successfully");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Update failed. Please try again"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-4">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Name"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition w-full"
            disabled={loading}
          >
            {loading ? "Saving" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
