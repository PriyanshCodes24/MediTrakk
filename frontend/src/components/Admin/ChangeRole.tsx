import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../BackButton";
import api from "../../Utils/axios";

type User = {
  name: string;
  email: string;
  role: string;
};

const ChangeRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User>();

  const [newRole, setNewRole] = useState("patient");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/admin/user/${id}`);
        setUser(data.user);
      } catch (e: any) {
        console.error(e);
      }
    };
    fetchData();
  });

  const handleSubmit = async () => {
    try {
      await api.patch(`/admin/${id}/change-role`, { role: newRole });
      toast.success("Role changed successfully");
      navigate(-1);
    } catch (e: any) {
      toast.error(e.response.data.message || "Role could not be changed");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <BackButton />

        <h2 className="text-center mt-4 text-2xl font-semibold text-gray-800 mb-6">
          Change Role
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {user?.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Current Role:</strong>{" "}
              <span
                className={`font-semibold ${
                  user?.role === "admin"
                    ? "text-red-500"
                    : user?.role === "doctor"
                      ? "text-blue-500"
                      : "text-green-500"
                }`}
              >
                {user?.role}
              </span>
            </p>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select New Role
            </label>
            <select
              id="role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
            <button
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Confirm Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRole;
