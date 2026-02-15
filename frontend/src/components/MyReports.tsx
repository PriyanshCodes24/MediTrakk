import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../Utils/axios";

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
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get(`/reports/${user?.role}`);
        setReports(data.reports);
      } catch (e) {
        console.error("Failed to fetch reports", e);
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
      console.error("Download failed", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      setLoadingDelete(true);
      await api.delete(`/reports/${id}`);
      setReports((prev) => prev.filter((rep) => rep._id !== id));
      toast.success("Report deleted successfully");
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Report could not be deleted: ",
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleView = async (fileUrl: string) => {
    try {
      setViewingFile(fileUrl);
      const token = localStorage.getItem("token");
      const filename = fileUrl.split("/").pop();

      const response = await fetch(`${API}/reports/view/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (e) {
      console.error("Failed to open report", e);
      toast.error("Failed to open report");
    } finally {
      setViewingFile(null);
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return "📄";
    if (
      type.includes("image") ||
      type.includes("jpg") ||
      type.includes("jpeg") ||
      type.includes("png")
    )
      return "🖼️";
    if (
      type.includes("xls") ||
      type.includes("sheet") ||
      type.includes("excel")
    )
      return "📊";
    if (type.includes("doc") || type.includes("word")) return "📝";
    return "📁";
  };

  return (
    <div className="overflow-y-auto max-h-[628px] bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        My Reports ({reports.length})
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-600">No Reports Uploaded Yet.</p>
      ) : (
        <>
          <ul className="text-gray-700 space-y-4 text-sm">
            {reports.map((rep) => (
              <div
                key={rep._id}
                className="bg-white rounded-xl shadow-md p-5 mb-4 hover:shadow-lg transition-shadow duration-400 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left side — report details */}
                  <div className="flex-1">
                    {/* File icon and name */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">
                        {getFileTypeIcon(rep.fileType)}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {rep.fileName}
                      </h3>
                    </div>

                    {/* Patient/User info */}
                    <p className="text-sm mt-1 text-gray-600">
                      <span className="font-medium">Patient:</span>{" "}
                      {rep?.user?.name || "Unknown"}
                    </p>

                    {/* File type */}
                    <p className="text-sm mt-1 text-gray-600">
                      <span className="font-medium">Type:</span>{" "}
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {rep.fileType}
                      </span>
                    </p>

                    {/* Upload date */}
                    <p className="text-sm mt-1 text-gray-600">
                      <span className="font-medium">Uploaded:</span>{" "}
                      {new Date(rep.uploadedAt).toLocaleDateString()} •{" "}
                      {new Date(rep.uploadedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Right side — action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDownload(rep.fileUrl, rep.fileName)}
                      className="cursor-pointer bg-blue-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
                    >
                      Download
                    </button>

                    <button
                      onClick={() => handleView(rep.fileUrl)}
                      disabled={viewingFile === rep.fileUrl}
                      className="cursor-pointer bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {viewingFile === rep.fileUrl ? "Opening..." : "View"}
                    </button>

                    {user?.role === "patient" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(rep._id)}
                        disabled={loadingDelete}
                        className="cursor-pointer bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingDelete ? "Deleting..." : "Delete"}
                      </button>
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

export default MyReports;
