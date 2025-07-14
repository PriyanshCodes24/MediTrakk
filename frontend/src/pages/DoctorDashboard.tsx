import { useAuth } from "../context/AuthContext";
import MyAppointments from "../components/MyAppointments";
import UserProfile from "../components/UserProfile";
import MyReports from "../components/MyReports";

const DoctorDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-bold text-3xl text-center text-gray-800 mb-8">
          {`Welcome, Dr. ${user?.name}`}
        </h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* card-1 */}
          <MyAppointments />
          {/* card-2 */}
          <MyReports />
          {/* card-3 */}
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
