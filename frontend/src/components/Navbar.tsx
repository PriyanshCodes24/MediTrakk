import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Navitem from "./Navitem";
import { BsCalendarPlus } from "react-icons/bs";
import { FaUserAlt, FaUserInjured } from "react-icons/fa";
import { FiGrid, FiLogOut, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaUserDoctor, FaUserShield } from "react-icons/fa6";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logoutHandler = () => {
    setOpen(false);
    if (window.confirm("Are you sure you want to sign out")) {
      logout();
      navigate("/login");
    }
  };
  const capitalize = (role: string) => {
    const cap = role.charAt(0).toUpperCase() + role.slice(1);
    return cap;
  };

  return (
    <motion.nav className=" flex items-center justify-end bg-blue-500 p-4 text-white">
      {user && (
        <div className={`flex mr-auto gap-1 items-center `}>
          {user?.role === "admin" ? (
            <FaUserShield size={18} title="admin" className="text-sm" />
          ) : user?.role === "doctor" ? (
            <FaUserDoctor size={18} title="doctor" className="text-sm" />
          ) : (
            <FaUserInjured size={18} title="patient" className="text-sm" />
          )}
          <div className="md:block hidden text-sm text-gray-300">
            {capitalize(user?.role) || ""}
          </div>
        </div>
      )}
      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-4 ml-auto">
        {user?.role === "patient" && (
          <Navitem
            label="Create-Appoinment"
            icon={BsCalendarPlus}
            active={location.pathname === "/create-appointment"}
            title={"Create-Appointment"}
            onClick={() => navigate("/create-appointment")}
            size={18}
          />
        )}
        {user && (
          <Navitem
            label="Upload-Report"
            icon={FiUpload}
            active={location.pathname === "/upload-report"}
            title={"Create-Appointment"}
            onClick={() => navigate("/upload-report")}
            size={20}
          />
        )}
        {user && user?.role !== "admin" && (
          <Navitem
            label="Dashboard"
            icon={FiGrid}
            active={location.pathname === "/dashboard"}
            title={"Dashboard"}
            onClick={() => navigate("/dashboard")}
            size={18}
          />
        )}
        {user && user?.role === "admin" && (
          <Navitem
            label="Dashboard"
            icon={FiGrid}
            active={location.pathname === "/admin-dashboard"}
            title={"Dashboard"}
            onClick={() => navigate("/admin-dashboard")}
            size={18}
          />
        )}

        {user && (
          <Navitem
            label="Profile"
            icon={FaUserAlt}
            active={location.pathname === "/profile"}
            title={"Profile"}
            onClick={() => navigate("/profile")}
            size={18}
          />
        )}

        {user && (
          <Navitem
            label="Logout"
            icon={FiLogOut}
            active={false}
            title={"Logout"}
            onClick={logoutHandler}
            size={18}
          />
        )}
        {!user && (
          <>
            <motion.div
              layout
              className={`flex items-center transition-colors px-3 py-2 rounded-md cursor-pointer text-gray-300 hover:text-white  ${
                location.pathname === "/login" &&
                "text-white bg-white/10 font-semibold"
              }`}
              onClick={() => navigate("/login")}
            >
              Login
            </motion.div>
            <motion.div
              layout
              className={`flex items-center transition-colors px-3 py-2 rounded-md cursor-pointer text-gray-300 hover:text-white ${
                location.pathname === "/register" &&
                "text-white bg-white/10 font-semibold"
              }`}
              onClick={() => navigate("/register")}
            >
              Register
            </motion.div>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden ml-auto relative w-9 h-9 flex items-center justify-center group cursor-pointer"
      >
        <span
          className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${
            open ? "rotate-45" : "-translate-y-2"
          }`}
        />
        <span
          className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${
            open ? "-rotate-45" : "translate-y-2"
          }`}
        />
      </button>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute top-17 left-0 w-full bg-blue-500/95 backdrop-blur-md text-white shadow-lg flex flex-col space-y-3 border-t border-white/20 p-4 md:hidden z-50 ">
          {!user && (
            <>
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="py-2 px-3 rounded-md hover:bg-white/10 transition"
              >
                Login
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/register"
                className="py-2 px-3 rounded-md hover:bg-white/10 transition"
              >
                Register
              </Link>
            </>
          )}

          {user && user?.role === "patient" && (
            <Link
              onClick={() => setOpen(false)}
              to="/create-appointment"
              className="py-2 px-3 rounded-md hover:bg-white/10 transition"
            >
              Create-Appointment
            </Link>
          )}

          {user && (
            <Link
              onClick={() => setOpen(false)}
              to="/upload-report"
              className="py-2 px-3 rounded-md hover:bg-white/10 transition"
            >
              Upload-Report
            </Link>
          )}

          {user && user?.role !== "admin" && (
            <Link
              onClick={() => setOpen(false)}
              to="/dashboard"
              className="py-2 px-3 rounded-md hover:bg-white/10 transition"
            >
              Dashboard
            </Link>
          )}

          {user && user?.role === "admin" && (
            <Link
              onClick={() => setOpen(false)}
              to="/admin-dashboard"
              className="py-2 px-3 rounded-md hover:bg-white/10 transition"
            >
              Dashboard
            </Link>
          )}

          {user && (
            <Link
              onClick={() => setOpen(false)}
              to="/profile"
              className="py-2 px-3 rounded-md hover:bg-white/10 transition"
            >
              Profile
            </Link>
          )}

          {user && (
            <button
              onClick={logoutHandler}
              className="py-2 px-3 rounded-md hover:bg-white/10 transition cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </motion.nav>
  );
};
