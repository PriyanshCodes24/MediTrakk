import axios from "axios";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

type stats = {
  users: number;
  patients: number;
  doctors: number;
  reports: number;
  appointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  completedAppointments: number;
};

type StatCardsProps = {
  label: string;
  value: number;
  bgClass?: string;
  borderClass?: string;
};

function StatCard({
  label,
  value,
  bgClass = "bg-white",
  borderClass = "border-gray-200",
}: StatCardsProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${bgClass} ${borderClass} flex flex-col justify-between h-full`}
    >
      <p className="text-sm text-gray-600 text-center break-words">{label}</p>
      <p className="text-xl font-bold text-center">{value}</p>
    </div>
  );
}

const AdminStats = () => {
  const [stats, setStats] = useState<stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(data);
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="max-h-[650px] bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      <h2 className="font-semibold text-gray-800 text-xl mb-4">Admin Stats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="mb-4">
            <strong className="block mb-2">User stats</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
              <StatCard
                label="Total Users"
                value={stats?.users ?? 0}
                bgClass="bg-blue-100"
                borderClass="border-blue-200"
              />
              <StatCard
                label="Total Patients"
                value={stats?.patients ?? 0}
                bgClass="bg-blue-100"
                borderClass="border-blue-200"
              />
              <StatCard
                label="Total Doctors"
                value={stats?.doctors ?? 0}
                bgClass="bg-blue-100"
                borderClass="border-blue-200"
              />
            </div>
          </div>
          <div className="mb-4">
            <strong className="block mb-2">Appointment stats</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
              <StatCard
                label="Total"
                value={stats?.appointments ?? 0}
                bgClass="bg-indigo-50"
                borderClass="border-indigo-200"
              />
              <StatCard
                label="Pending"
                value={stats?.pendingAppointments ?? 0}
                bgClass="bg-yellow-50"
                borderClass="border-yellow-200"
              />
              <StatCard
                label="Approved"
                value={stats?.approvedAppointments ?? 0}
                bgClass="bg-green-50"
                borderClass="border-green-200"
              />
              <StatCard
                label="Rejected"
                value={stats?.rejectedAppointments ?? 0}
                bgClass="bg-red-50"
                borderClass="border-red-200"
              />
              <StatCard
                label="Cancelled"
                value={stats?.cancelledAppointments ?? 0}
                bgClass="bg-gray-50"
                borderClass="border-gray-200"
              />
              <StatCard
                label="Completed"
                value={stats?.completedAppointments ?? 0}
                bgClass="bg-purple-50"
                borderClass="border-purple-200"
              />
            </div>
          </div>

          <div className="mb-4">
            <strong className="block mb-2">Report stats</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
              <StatCard
                label="Total Reports"
                value={stats?.reports ?? 0}
                bgClass="bg-pink-50"
                borderClass="border-pink-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
