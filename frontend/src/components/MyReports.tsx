import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;
const BASE_URL = API.replace("/api", "");

type Report = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
};

const MyReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/reports/${user?.role}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(data.reports);
        // console.log(data);
      } catch (e) {
        console.log("Failed to fetch reports", e);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const res = await fetch(`${BASE_URL}${fileUrl}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      link.remove();
    } catch (e) {
      console.log("Download failed", e);
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete the appointment?"))
      return;
    try {
      setLoadingDelete(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${API}/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      setReports((prev) => prev.filter((rep) => rep._id !== id));
      toast.success("Report deleted successfully");
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Report could not be deleted: "
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div
      className="overflow-y-auto max-h-[628px]
    bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 ">
        My Reports({reports.length})
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-gray-500">No Reports Uploaded Yet.</p>
      ) : (
        <ul className="text-gray-700 space-y-4 text-sm">
          {reports.map((rep) => (
            <li key={rep._id} className="border-b pb-4">
              <p>
                <strong>Patient:</strong>{" "}
                <span className="text-gray-700">
                  {rep.user?.name || "Unknown"}
                </span>
              </p>
              <p>
                <strong>Name:</strong>{" "}
                <span className="text-gray-700">{rep.fileName}</span>
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <span className="text-gray-700">{rep.fileUrl}</span>
              </p>
              <p>
                <strong>Type:</strong>{" "}
                <span className="text-gray-700">{rep.fileType}</span>
              </p>
              <p>
                <strong>Uploaded:</strong>{" "}
                <span className="text-gray-700">
                  {new Date(rep.uploadedAt).toLocaleString()}
                </span>
              </p>
              <p>
                <strong>View:</strong>{" "}
                <a
                  href={`${BASE_URL}${rep.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-500"
                >
                  Open Report
                </a>
              </p>
              <p>
                <button
                  onClick={() => handleDownload(rep.fileUrl, rep.fileName)}
                  className="bg-blue-400 text-white rounded-lg px-2 py-1 mt-2 cursor-pointer hover:bg-blue-500"
                >
                  Download
                </button>
                {user?.role === "patient" && (
                  <button
                    type="button"
                    onClick={() => handleDelete(rep._id)}
                    disabled={loadingDelete}
                    className="ml-2 bg-blue-400 text-white rounded-lg px-2 py-1 mt-2 cursor-pointer hover:bg-blue-500"
                  >
                    {loadingDelete ? "Deleting..." : "Delete"}
                  </button>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReports;
