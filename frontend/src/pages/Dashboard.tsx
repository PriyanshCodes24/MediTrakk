import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome, {user?.name || "User"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">
              Upcoming-appointments
            </h2>
            <p className="text-gray-600">No upcoming-appointments</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Medical Reports</h2>
            <p className="text-gray-600">No reports uploaded yet</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <p className="text-gray-600">Name: {user?.name}</p>
            <p className="text-gray-600">Email: {user?.email}</p>
            <p className="text-gray-600">Role: {user?.role}</p>
            <button
              onClick={() => navigate("/edit-profile")}
              className="mt-4 py-2 px-4 bg-blue-500 rounded-lg text-white hover:bg-blue-600 cursor-pointer transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
