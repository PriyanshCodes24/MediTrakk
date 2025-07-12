import axios from "axios";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const UploadReport = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be smaller than 5MB");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("report", file);

      const { data } = await axios.post(`${API}/reports/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("File uploaded succeessfully");
      console.log(data);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);
    } catch (e) {
      toast.error("File upload failed");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log(file?.size);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-sm w-full rounded-xl p-6 shadow-lg bg-white">
        <h1 className="font-bold text-center text-xl mb-4">Upload Report</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.jpg,.jpeg,.png"
            className="block w-full text-sm text-gray-600 file:text-white
                       file:mr-4 file:bg-blue-400 hover:file:bg-blue-500
                       transition file:px-1 file:cursor-pointer
                       file:py-1 file:rounded-md file:border-0 "
            onChange={handleChange}
          />
          <button
            className="hover:bg-blue-600 text-white bg-blue-500 cursor-pointer rounded-md py-2 transition"
            type="submit"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadReport;
