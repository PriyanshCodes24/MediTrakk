import { useAuth } from "../context/AuthContext";
import MyReports from "../components/MyReports";
import MyAppointments from "../components/MyAppointments";
// import UserProfile from "../components/UserProfile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  let greet = "";
  if (user.role === "doctor") greet = " Dr. ";
  useEffect(() => {
    if (user?.role === "admin") navigate("/admin-dashboard");
    else navigate("/dashboard");
  }, [user?.role]);

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto  ">
        <h1 className="text-3xl  font-bold mb-8 text-center text-gray-800">
          {`Welcome,${greet} ${user?.name || "User"}`}
        </h1>
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
            onClick={() => navigate("/create-appointment")}
          >
            Book Appointment
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            View Profile
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
            onClick={() => navigate("/upload-report")}
          >
            Upload Report
          </button>
        </div>

        {/* Overview Section */}
        <div></div>

        <div className=" grid gap-6 grid-cols-1 sm:grid-cols-2 ">
          {/* card-1 */}
          <MyAppointments />
          {/* card-2 */}
          <MyReports />
        </div>

        {/* companion window */}
        <div className="mt-8">{/* <CompanionWindow /> */}</div>
      </div>
    </div>
  );
};
