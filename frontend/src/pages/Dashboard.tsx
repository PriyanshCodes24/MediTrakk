import { useAuth } from "../context/AuthContext";
import MyReports from "../components/MyReports";
import MyAppointments from "../components/MyAppointments";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Greeting line based on role
  const greetPrefix = useMemo(
    () => (user?.role === "doctor" ? " Dr. " : " "),
    [user?.role],
  );

  // Local stats state
  const [loadingStats, setLoadingStats] = useState(true);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  // Redirect admins away from user dashboard
  useEffect(() => {
    if (user?.role === "admin") navigate("/admin-dashboard");
  }, [user?.role, navigate]);

  // Fetch lightweight stats for header cards
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.role) return;
      try {
        setLoadingStats(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [appointmentsRes, reportsRes] = await Promise.all([
          axios.get(`${API}/appointments/${user.role}`, { headers }),
          axios.get(`${API}/reports/${user.role}`, { headers }),
        ]);

        const appointments = appointmentsRes?.data?.appointments || [];
        const now = new Date();
        const upcoming = appointments.filter(
          (a: any) => new Date(a.date) >= now,
        );
        const pending = appointments.filter((a: any) => a.status === "pending");
        setUpcomingCount(upcoming.length);
        setPendingCount(pending.length);

        const reports = reportsRes?.data?.reports || [];
        setReportsCount(reports.length);
      } catch (e) {
        // best-effort; keep UI resilient
        setUpcomingCount(0);
        setPendingCount(0);
        setReportsCount(0);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user?.role]);

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {`Welcome,${greetPrefix}${user?.name || "User"}`}
              </h1>
              <p className="mt-1 text-white/80">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition"
                onClick={() => navigate("/profile")}
                type="button"
              >
                <span>View Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick actions */}
            <div
              className={`grid grid-cols-1 
              ${user.role === "patient" ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4`}
            >
              {user.role === "patient" && (
                <button
                  type="button"
                  onClick={() => navigate("/create-appointment")}
                  className="cursor-pointer group rounded-xl bg-white p-4 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition flex items-center gap-3"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    {/* calendar icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M6.75 3a.75.75 0 0 1 .75.75V5h9V3.75a.75.75 0 1 1 1.5 0V5h.75A2.25 2.25 0 0 1 21 7.25v11.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V7.25A2.25 2.25 0 0 1 5.25 5H6V3.75A.75.75 0 0 1 6.75 3ZM4.5 9v9.75c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75V9H4.5Z" />
                    </svg>
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-semibold text-gray-800">
                      Book Appointment
                    </span>
                    <span className="block text-xs text-gray-500">
                      Schedule with your doctor
                    </span>
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate("/upload-report")}
                className="cursor-pointer group rounded-xl bg-white p-4 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition flex items-center gap-3"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  {/* upload icon (arrow-up-tray) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 9l4.5-4.5L16.5 9M12 4.5v12"
                    />
                  </svg>
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-gray-800">
                    Upload Report
                  </span>
                  <span className="block text-xs text-gray-500">
                    Add new medical files
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="cursor-pointer group rounded-xl bg-white p-4 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition flex items-center gap-3"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  {/* user icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 2.25a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM3.75 20.25a8.25 8.25 0 1 1 16.5 0 .75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75Z" />
                  </svg>
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-gray-800">
                    Profile
                  </span>
                  <span className="block text-xs text-gray-500">
                    Manage account & info
                  </span>
                </span>
              </button>
            </div>

            {/* Lists */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <MyAppointments />
              <MyReports />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-blue-700">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {loadingStats ? "—" : upcomingCount}
                  </p>
                </div>
                <div className="rounded-xl bg-yellow-50 p-4">
                  <p className="text-xs text-yellow-700">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {loadingStats ? "—" : pendingCount}
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-4 sm:col-span-2">
                  <p className="text-xs text-green-700">Reports</p>
                  <p className="text-2xl font-bold text-green-900">
                    {loadingStats ? "—" : reportsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips</h3>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Keep your reports organized for quick access.</li>
                <li>Confirm appointments at least 24 hours ahead.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
