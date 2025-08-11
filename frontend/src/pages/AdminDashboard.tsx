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

  let greet = "";
  if (user.role === "doctor") greet = " Dr. ";

  return (
    <div className="h-screen px-4 py-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center font-bold text-3xl mb-8 text-gray-800">
          {`Welcome, ${user?.name || "Admin"}`}
        </h1>
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
