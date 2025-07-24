import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
  patient: {
    name: string;
    email: string;
  };
};

const API = import.meta.env.VITE_API_URL;

export const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/appointments/${user.role}`, {
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
        console.log(data);
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
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      {/* card-1 */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upcoming Appointments({appointments.length})
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
              {user?.role === "patient" && (
                <p>
                  <strong>Doctor:</strong> {appt.doctor.name}
                </p>
              )}
              {user?.role === "doctor" && (
                <p>
                  <strong>Patient:</strong> {appt.patient.name}
                </p>
              )}
              <p>
                <strong>Email:</strong>{" "}
                {user?.role === "doctor"
                  ? appt.patient.email
                  : appt.doctor.email}
              </p>
              <p>
                <strong>Reason:</strong> {appt.reason}
              </p>
              <p>
                <strong>Status:</strong> {appt.status}
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
  );
};

export default MyAppointments;
