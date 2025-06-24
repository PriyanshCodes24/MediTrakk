import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to sign out")) {
      logout();
      navigate("/login");
    }
  };
  return (
    <nav className="bg-blue-500 p-4 flex text-white justify-end">
      <div className="flex gap-4">
        <Link
          to="/"
          className=" hover:text-gray-200 hover:underline transition"
        >
          Home
        </Link>
        {!user && (
          <Link
            to="/login"
            className="  hover:text-gray-200 hover:underline transition"
          >
            Sign In
          </Link>
        )}
        {!user && (
          <Link
            to="/register"
            className="hover:text-gray-200 hover:underline transition"
          >
            Sign Up
          </Link>
        )}
        <Link
          to="/dashboard"
          className=" hover:text-gray-200 hover:underline transition"
        >
          Dashboard
        </Link>
        {user && (
          <button
            className="hover:text-gray-200 hover:underline cursor-pointer transition"
            onClick={logoutHandler}
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};
