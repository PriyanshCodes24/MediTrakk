import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 ">
        User Profile
      </h2>
      <div className="space-y-1">
        <p className="text-gray-600">Name: {user?.name}</p>
        <p className="text-gray-600">Email: {user?.email}</p>
        <p className="text-gray-600">Role: {user?.role}</p>
      </div>
      <button
        onClick={() => navigate("/edit-profile")}
        className="mt-4 py-2 px-4 bg-blue-500 rounded-lg text-white hover:bg-blue-600 active:scale-95 cursor-pointer transition"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default UserProfile;
