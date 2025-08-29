import AllReports from "../components/Admin/AllReports";
import AllUsers from "../components/Admin/AllUsers";
import AdminStats from "../components/Admin/AdminStats";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (user?.role === "patient" || user?.role === "doctor"))
      navigate("/dashboard");
  }, [loading, user?.role]);
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {`Welcome, ${user?.name || "Admin"}`}
              </h1>
              <p className="mt-1 text-white/80">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* card-1 */}
          <AllUsers />
          {/* card-2 */}
          <AllReports />
          {/* card-3 */}
          <AdminStats />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
