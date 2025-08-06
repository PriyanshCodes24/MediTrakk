import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Appointment = {
  _id: string;
  date: string;
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
  const [filterStatus, setFilterStatus] = useState<
    "" | "approved" | "cancelled" | "pending" | "completed" | "rejected"
  >("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/appointments/${user.role}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const upcoming = data.appointments.filter((appt: Appointment) => {
          const apptDate = new Date(appt.date);
          const now = new Date();
          const isUpcoming = apptDate >= now;
          const matchStatus =
            filterStatus === "" || appt.status === filterStatus;
          return isUpcoming && matchStatus;
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
  }, [filterStatus, user?.role]);

  const handleCancleButton = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel the appointment?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "cancelled" } : appt
        )
      );
      toast.success("Appointment cancelled successfully");
    } catch (e: any) {
      console.log(e);
      toast.error(`Appointment couldn't be cancelled: ${e}`);
    }
  };
  const handleApproveButton = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel the appointment?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/appointments/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "approved" } : appt
        )
      );
      toast.success("Appointment approved successfully");
    } catch (e: any) {
      console.log(e);
      toast.error(`Appointment couldn't be approved`);
    }
  };
  const handleRejectButton = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject the appointment?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/appointments/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "rejected" } : appt
        )
      );
      toast.success("Appointment rejected successfully");
    } catch (e: any) {
      console.log(e);
      toast.error(`Appointment couldn't be rejected`);
    }
  };
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(
      e.target.value as
        | ""
        | "approved"
        | "cancelled"
        | "pending"
        | "completed"
        | "rejected"
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      {/* card-1 */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upcoming Appointments({appointments.length})
      </h2>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="filter" className="text-sm font-medium text-gray-700">
          Filter:
        </label>
        <select
          id="filter"
          name="filter"
          value={filterStatus}
          onChange={handleFilter}
          className="w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
        >
          <option value="">All</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loadingAppointments ? (
        <p className="text-gray-500">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600">{`No upcoming ${filterStatus} appointments`}</p>
      ) : (
        <>
          <ul className="text-gray-700 space-y-4 text-sm">
            {appointments.map((appt) => (
              <li key={appt._id} className="border-b pb-6">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appt.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {appt.date.split("T")[1].split(".")[0]}
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
                  <strong>Status:</strong>{" "}
                  <span
                    className={`
                    ${appt.status === "approved" && "text-green-600"}
                    ${appt.status === "rejected" && "text-red-700"}
                    ${appt.status === "cancelled" && "text-orange-500"}
                    ${appt.status === "pending" && "text-yellow-500"}
                    ${appt.status === "completed" && "text-blue-600"}
                    `}
                  >
                    {appt.status}
                  </span>
                </p>
                {(user?.role === "patient"
                  ? ["approved", "pending", undefined].includes(appt?.status)
                  : appt.status === "approved") && (
                  <button
                    onClick={() => handleCancleButton(appt._id)}
                    type="button"
                    className="text-xs bg-blue-400 hover:bg-blue-500 mt-1 text-white rounded-lg px-1 py-1 border cursor-pointer transition"
                  >
                    Cancel
                  </button>
                )}
                {user?.role === "doctor" && appt.status === "pending" && (
                  <button
                    onClick={() => handleApproveButton(appt._id)}
                    type="button"
                    className="text-xs bg-blue-400 mr-1 hover:bg-blue-500 mt-2 text-white rounded-lg px-1 py-1 border cursor-pointer transition"
                  >
                    Approve
                  </button>
                )}
                {user?.role === "doctor" && appt.status === "pending" && (
                  <button
                    onClick={() => handleRejectButton(appt._id)}
                    type="button"
                    className="text-xs bg-blue-400 hover:bg-blue-500 mt-1 text-white rounded-lg px-1 py-1 border cursor-pointer transition"
                  >
                    Reject
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MyAppointments;
