import axios from "axios";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

const API = import.meta.env.VITE_API_URL;

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(data.users);
        console.log(data);
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg ring-1 ring-gray-200 transition max-w-2xl">
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
              <p>
                <strong>Role: </strong>
                <span
                  className={`${
                    user.role === "admin"
                      ? " text-red-500"
                      : user.role === "doctor"
                      ? "text-blue-500"
                      : "text-green-500"
                  }`}
                >
                  {user.role}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllUsers;
