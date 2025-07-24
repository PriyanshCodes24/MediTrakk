import axios from "axios";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

type stats = {
  users: number;
  patients: number;
  doctors: number;
  appointments: number;
  reports: number;
};

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
        console.log(data);
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
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      <h2 className="font-semibold text-gray-800 text-xl mb-4">Stats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <strong>User stats</strong>
            <br />
            <p className="text-sm">Total Users: {stats?.users}</p>
            <p className="text-sm">Total Patients: {stats?.patients}</p>
            <p className="text-sm">Total Doctors: {stats?.doctors}</p>
          </div>
          <div>
            <strong>Appointment stats</strong>
            <br />
            <p className="text-sm">Total Appointments: {stats?.appointments}</p>
            <p className="text-sm">Upcoming Appointments: {}</p>
            <p className="text-sm">Canceled Appointments: {}</p>
          </div>
          <div>
            <strong>Report stats</strong>
            <br />
            <p className="text-sm">Total Reports: {stats?.reports}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
