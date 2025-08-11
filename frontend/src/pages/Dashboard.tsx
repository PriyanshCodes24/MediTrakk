import { useAuth } from "../context/AuthContext";
import MyReports from "../components/MyReports";
import MyAppointments from "../components/MyAppointments";
import UserProfile from "../components/UserProfile";
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
        <div className=" grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
