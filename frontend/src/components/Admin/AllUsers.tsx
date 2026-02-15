import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../Utils/axios";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const { data } = await api.get(`/users/all`);
        setUsers(data.users);
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);
  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete the report?"))
        return;
      setLoadingDelete(true);
      await api.delete(`/users/${id}`);

      setUsers((objs) => objs.filter((obj) => obj._id !== id));

      toast.success("User deleted successfully");
    } catch (e: any) {
      console.error(e);
      toast.error("User could not be deleted");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="max-h-[650px] overflow-y-auto bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
      <h2 className="font-semibold  text-gray-800 text-xl mb-4">
        Users Registerd ({users.length})
      </h2>
      {loadingUsers ? (
        <p className="text-gray-500">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No Users Found</p>
      ) : (
        <ul className="space-y-4 text-gray-700 text-sm">
          {users.map((user) => (
            <li className="border-b pb-6" key={user._id}>
              <p>
                <strong>Name: </strong>
                {user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {user.email}
              </p>
              <p className="flex items-center gap-2">
                <strong>Role: </strong>
                <span
                  className={`${
                    user.role === "admin"
                      ? " text-red-500"
                      : user.role === "doctor"
                        ? "text-blue-500"
                        : "text-green-500"
                  } `}
                >
                  {user.role}
                </span>
                <button
                  type="button"
                  className="ml-auto px-2 py-1 text-xs text-white bg-yellow-400  rounded-md hover:bg-yellow-500 cursor-pointer  "
                  onClick={() => navigate(`/change-role/${user._id}`)}
                >
                  Change
                </button>
              </p>
              {
                <button
                  type="button"
                  className="text-white bg-blue-400 px-2 py-1 rounded-md hover:bg-blue-500 cursor-pointer mt-2 "
                  onClick={() => handleDelete(user._id)}
                >
                  {loadingDelete ? "deleting..." : "delete"}
                </button>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllUsers;
