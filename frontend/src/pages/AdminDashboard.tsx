import AllReports from "../components/Admin/AllReports";
import AllUsers from "../components/Admin/AllUsers";
import AdminStats from "../components/Admin/AdminStats";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
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
