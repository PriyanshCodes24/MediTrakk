import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import BackButton from "./BackButton";
import Skeleton from "./Skeleton";

type User = {
  name: string;
  email: string;
  role: string;
  contact: number;
  createdAt: string;
};

const API = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<User>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(data?.user);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load profile.",
        );
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className=" min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition ">
        <BackButton />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 mt-6 sm:mt-8 sm:mb-8 text-center sm:text-left">
          <div className="w-20 h-20 sm:h-24 sm:w-24 text-3xl sm:text-4xl rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
            {userInfo?.name?.charAt(0) ?? "?"}
          </div>
          {loading ? (
            <div className="">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-60 " />
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {userInfo?.name || "--"}
              </h1>
              <p className="text-gray-500 capitalize">
                {userInfo?.role || "Unknown Role"}
              </p>
              <p className="text-gray-400 text-sm">{userInfo?.email}</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Contact</p>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <p className="text-gray-800 font-medium">
                {userInfo?.contact || "Not Provided"}
              </p>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Joined</p>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <p className="text-gray-800 font-medium">
                {userInfo?.createdAt
                  ? new Date(userInfo?.createdAt).toLocaleDateString()
                  : "--"}
              </p>
            )}
          </div>
        </div>

        {/* Edit Profile */}
        <button
          onClick={() => navigate("/edit-profile")}
          className="mt-6 inline-flex items-center justify-center py-2.5 px-5 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm text-white active:scale-95 cursor-pointer transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
