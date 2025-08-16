import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const canGoBack = new Set(["/dashboard", "/admin-dashboard"]);
  const showBack = canGoBack.has(location.pathname);
  console.log(location);
  const navigate = useNavigate();
  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to sign out")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-blue-500 p-4 flex items-center text-white">
      {!showBack && (
        <button
          type="button"
          onClick={() =>
            window.history.length > 1 ? navigate(-1) : navigate("/")
          }
          className=" hover:text-gray-200 hover:underline transition cursor-pointer"
          aria-label="Go back"
        >
          <span className="text-xl leading-none inline-flex mb-1 -ml-1">
            &#8249;
          </span>
          <span> Back</span>
        </button>
      )}

      <div className="flex items-center gap-4 ml-auto">
        {/* <Link
          to="/"
          className=" hover:text-gray-200 hover:underline transition"
        >
          Home
        </Link> */}
        {!user && (
          <Link
            to="/login"
            className=" hover:text-gray-200 hover:underline transition"
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
        {user?.role === "patient" && (
          <Link
            to="/create-appointment"
            className="hover:text-gray-200 hover:underline transitions"
          >
            Create-Appoinment
          </Link>
        )}
        {user && (
          <Link
            to="/upload-report"
            className="hover:text-gray-200 hover:underline transitions"
          >
            Upload-Report
          </Link>
        )}
        {user?.role !== "admin" && (
          <Link
            to="/dashboard"
            className=" hover:text-gray-200 hover:underline transition"
          >
            Dashboard
          </Link>
        )}
        {user?.role === "admin" && (
          <Link
            to="/admin-dashboard"
            className=" hover:text-gray-200 hover:underline transition"
          >
            Dashboard
          </Link>
        )}

        <Link
          to="/profile"
          className=" hover:text-gray-200 hover:underline transition"
        >
          Profile
        </Link>

        {user && (
          <span>
            <button
              className="hover:text-gray-200 hover:underline cursor-pointer transition"
              onClick={logoutHandler}
            >
              Sign Out
            </button>
          </span>
        )}
      </div>
    </nav>
  );
};
