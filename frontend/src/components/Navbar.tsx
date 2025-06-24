import { Link } from "react-router-dom";

export const Navbar = () => {
  // const {}=use
  return (
    <nav className="bg-blue-500 p-4 flex text-white justify-end">
      <div className="flex gap-4">
        <Link
          to="/"
          className=" hover:text-gray-200 hover:underline transition"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="  hover:text-gray-200 hover:underline transition"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="hover:text-gray-200 hover:underline transition"
        >
          Sign Up
        </Link>
        <Link
          to="/dashboard"
          className=" hover:text-gray-200 hover:underline transition"
        >
          Dashboard
        </Link>
        {/* <Link
          to="/register"
          className="hover:text-gray-200 hover:underline transition"
        >
          Sign Out
        </Link> */}
      </div>
    </nav>
  );
};
