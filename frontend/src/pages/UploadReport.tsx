import axios from "axios";
import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const UploadReport = () => {
  // const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      await axios.post(`${API}/reports/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Report uploaded successfully!");
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
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return "📄";
    if (
      type.includes("image") ||
      type.includes("jpg") ||
      type.includes("jpeg") ||
      type.includes("png")
    )
      return "🖼️";
    if (type.includes("doc") || type.includes("word")) return "📝";
    if (type.includes("xls") || type.includes("excel")) return "📊";
    return "📁";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isFileTypeValid = (fileType: string) => {
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    return validTypes.includes(fileType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-md w-full">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📤</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Upload Medical Report
          </h1>
          <p className="text-gray-600 text-sm">
            Upload your medical reports, test results, or imaging files
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : file
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📁</span>
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, JPG, JPEG, PNG (Max 5MB)
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={removeFile}
                      className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      Change File
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="hidden"
            />

            {/* File Validation */}
            {file && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      file.size <= 5 * 1024 * 1024
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span
                    className={`text-sm ${
                      file.size <= 5 * 1024 * 1024
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    File size: {formatFileSize(file.size)}{" "}
                    {file.size <= 5 * 1024 * 1024 ? "(✓)" : "(✗ Max 5MB)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFileTypeValid(file.type) ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span
                    className={`text-sm ${
                      isFileTypeValid(file.type)
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    File type: {file.type}{" "}
                    {isFileTypeValid(file.type) ? "(✓)" : "(✗ Invalid type)"}
                  </span>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={
                !file ||
                loading ||
                (file &&
                  (!isFileTypeValid(file.type) || file.size > 5 * 1024 * 1024))
              }
              className="cursor-pointer w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </div>
              ) : (
                "Upload Report"
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💡 Upload Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure files are clear and readable</li>
              <li>• PDF files are recommended for documents</li>
              <li>• Image files should be high quality</li>
              <li>• Keep file names descriptive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;
