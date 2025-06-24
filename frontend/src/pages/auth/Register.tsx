import React from "react";

const Register = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-400">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-center text-xl font-bold mb-4">
          Sign Up as Patient
        </h1>
        <form className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="full name"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="email"
            placeholder="example@gmail.com"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="password"
            placeholder="password"
            className="border rounded-lg px-3 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition w-full"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
