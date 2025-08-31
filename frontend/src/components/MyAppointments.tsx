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
    <div className="overflow-y-auto max-h-[628px] bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      {/* Header */}
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
              <div
                key={appt._id}
                className="bg-white rounded-xl shadow-md p-5 mb-4 hover:shadow-lg transition-shadow duration-400"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left side — appointment details */}
                  <div>
                    {/* Name (doctor for patient, patient for doctor) */}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user?.role === "patient"
                        ? appt.doctor.name
                        : appt.patient.name}
                    </h3>

                    {/* Date & Time */}
                    <p className="text-sm text-gray-500">
                      {new Date(appt.date).toLocaleDateString()} •{" "}
                      {appt.date.split("T")[1].split(".")[0]}
                    </p>

                    {/* Email */}
                    <p className="text-sm mt-1 text-gray-600">
                      <span className="font-medium">Email:</span>{" "}
                      {user?.role === "doctor"
                        ? appt.patient.email
                        : appt.doctor.email}
                    </p>

                    {/* Reason */}
                    <p className="text-sm mt-1 text-gray-600">
                      <span className="font-medium">Reason:</span> {appt.reason}
                    </p>

                    {/* Status */}
                    <p className="text-sm mt-1">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                          appt.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : appt.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : appt.status === "cancelled"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </p>
                  </div>

                  {/* Right side — action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {(user?.role === "patient"
                      ? ["approved", "pending", undefined].includes(
                          appt?.status
                        )
                      : appt.status === "approved") && (
                      <button
                        onClick={() => handleCancleButton(appt._id)}
                        type="button"
                        className="cursor-pointer bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                    {user?.role === "doctor" && appt.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApproveButton(appt._id)}
                          type="button"
                          className="cursor-pointer bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectButton(appt._id)}
                          type="button"
                          className="cursor-pointer bg-gray-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-600 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MyAppointments;
