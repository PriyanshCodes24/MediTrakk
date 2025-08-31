import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const canGoBack = new Set(["/dashboard", "/admin-dashboard"]);
  const showBack = canGoBack.has(location.pathname);
  const navigate = useNavigate();
  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to sign out")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-blue-500 p-4 flex items-center text-white relative">
      {/* Back Button */}
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
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 ml-auto">
        {/* <Link
          to="/"
          className=" hover:text-gray-200 hover:underline transition"
        >
          Home
        </Link> */}
        {!user && (
          <>
            <Link
              to="/login"
              className=" hover:text-gray-200 hover:underline transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="hover:text-gray-200 hover:underline transition"
            >
              Sign Up
            </Link>
          </>
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

      {/* Mobile Hamburger */}
      <button className="md:hidden ml-auto" onClick={() => setOpen(!open)}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute top-14 left-0 w-full bg-gray-50 text-gray-900 border-b border-gray-200 flex flex-col gap-4 p-4 md:hidden z-50 ">
          {!user && (
            <>
              <Link
                to="/login"
                className="hover:text-gray-200 hover:underline transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-200 hover:underline transition"
              >
                Sign Up
              </Link>
            </>
          )}

          {user?.role === "patient" && (
            <Link
              to="/create-appointment"
              className="hover:text-gray-200 hover:underline transition"
            >
              Create-Appointment
            </Link>
          )}

          {user && (
            <Link
              to="/upload-report"
              className="hover:text-gray-200 hover:underline transition"
            >
              Upload-Report
            </Link>
          )}

          {user?.role !== "admin" && (
            <Link
              to="/dashboard"
              className="hover:text-gray-200 hover:underline transition"
            >
              Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin-dashboard"
              className="hover:text-gray-200 hover:underline transition"
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/profile"
            className="hover:text-gray-200 hover:underline transition"
          >
            Profile
          </Link>

          {user && (
            <button
              onClick={logoutHandler}
              className="hover:text-gray-200 hover:underline transition cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
