import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MyReports from "./MyReports";

type Appointment = {
  _id: string;
  date: string;
  time: string;
  reason?: string;
  status?: string;
  doctor: {
    name: string;
    email: string;
  };
};

const API = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/appointments/patient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = data.appointments.filter((appt: Appointment) => {
          const apptDate = new Date(appt.date);
          apptDate.setHours(0, 0, 0, 0);
          return apptDate >= today;
        });

        setAppointments(upcoming);
      } catch (e) {
        console.error("Failed to fetch appointments", e);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancleButton = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel the appointment?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments((prev) => prev.filter((appt) => appt._id != id));
      toast.success("Appointment canceled successfully");
    } catch (e) {
      toast.error(`Appointment couldn't be canceled: ${e}`);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto  ">
        <h1 className="text-3xl  font-bold mb-8 text-center text-gray-800">
          Welcome, {user?.name || "User"}
        </h1>
        <div className=" grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* card-1 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Upcoming Appointments
            </h2>
            {loadingAppointments ? (
              <p className="text-gray-500">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="text-gray-600">No upcoming appointments</p>
            ) : (
              <ul className="text-gray-700 space-y-4 text-sm">
                {appointments.map((appt) => (
                  <li key={appt._id} className="border-b pb-6">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appt.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {appt.time}
                    </p>
                    <p>
                      <strong>Doctor:</strong> {appt.doctor.name}
                    </p>
                    <p>
                      <strong>Reason:</strong> {appt.reason}
                    </p>
                    <button
                      onClick={() => handleCancleButton(appt._id)}
                      type="button"
                      className="text-xs bg-blue-400 hover:bg-blue-500 mt-1 text-white rounded-lg px-1 py-1 border cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* card-2 */}
          <MyReports />
          {/* card-3 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 ">
              User Profile
            </h2>
            <div className="space-y-1">
              <p className="text-gray-600">Name: {user?.name}</p>
              <p className="text-gray-600">Email: {user?.email}</p>
              <p className="text-gray-600">Role: {user?.role}</p>
            </div>
            <button
              onClick={() => navigate("/edit-profile")}
              className="mt-4 py-2 px-4 bg-blue-500 rounded-lg text-white hover:bg-blue-600 active:scale-95 cursor-pointer transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
