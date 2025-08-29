import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

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

const AllReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/reports/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(data.reports);
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);
  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete the report?"))
        return;
      setLoadingDelete(true);
      await axios.delete(`${API}/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports((prev) => prev.filter((rep) => rep._id !== id));

      toast.success("Report deleted successfully");
    } catch (e: any) {
      console.log(e);
      toast.error("Report could not be deleted");
    } finally {
      setLoadingDelete(false);
    }
  };
  return (
    <div className="overflow-y-auto max-h-[650px] bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      <h2 className="font-semibold text-gray-700 text-xl mb-4">
        Uploaded Reports ({reports.length})
      </h2>
      <ul className="text-gray-700 text-sm space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : reports.length === 0 ? (
          <p className="text-gray-500">No Reports Found</p>
        ) : (
          reports.map((report) => (
            <li className="border-b pb-4 " key={report._id}>
              <p>
                <strong>Uploader: </strong>
                <span className="text-gray-700">
                  {report?.user?.name}(
                  <span className="text-gray-500">{report?.user?.email}</span>)
                </span>
              </p>
              <p>
                <strong>Name: </strong>
                <span className="text-gray-700">{report?.fileName}</span>
              </p>

              <p>
                <strong>Type: </strong>
                <span className="text-gray-700">{report?.fileType}</span>
              </p>
              <p>
                <strong>UploadedAt: </strong>
                <span className="text-gray-700">
                  {new Date(report?.uploadedAt).toUTCString()}
                </span>
              </p>
              <button
                type="button"
                className="text-white bg-blue-400 px-2 py-1 rounded-md hover:bg-blue-500 cursor-pointer mt-2 "
                onClick={() => handleDelete(report._id)}
              >
                {loadingDelete ? "deleting..." : "delete"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AllReports;
