import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <div className=" min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition ">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
            {user?.name?.charAt(0) ?? "?"}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {user?.name || "--"}
            </h1>
            <p className="text-gray-500 capitalize">
              {user?.role || "Unknown Role"}
            </p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Phone</h2>
            <p className="text-gray-800">{user?.phone || "Not Provided"}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Joined</h2>
            <p className="text-gray-800">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "--"}
            </p>
          </div>
        </div>

        {/* Edit Profile */}
        <button
          onClick={() => navigate("/edit-profile")}
          className="mt-6 py-2 px-4 bg-blue-500 rounded-lg text-white hover:bg-blue-600 active:scale-95 cursor-pointer transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
