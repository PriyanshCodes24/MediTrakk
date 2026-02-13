import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";

const API = import.meta.env.VITE_API_URL;

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contact, setContact] = useState(user?.contact || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const showErrors = submitted;
  const nameError = showErrors && !name.trim();
  const emailError = showErrors && !email.trim();
  const contactError = showErrors && !contact;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!name.trim() || !email.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `${API}/users/update`,
        { name, email, contact },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUser(data.user);
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Update failed. Please try again",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg ring-1 ring-black/5 p-6 sm:p-8">
        <BackButton />
        <h1 className="mt-4 text-center text-2xl font-semibold text-gray-900">
          Edit Profile
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Update your display name and email address.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 mt-6"
          noValidate
        >
          <label className="block" htmlFor="name">
            <span className="text-sm font-medium text-gray-700">Name:</span>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={isSubmitting}
              className={`mt-1 block w-full rounded-md border p-2.5 shadow-sm focus:outline-none ${
                nameError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              aria-invalid={nameError}
              aria-describedby={nameError ? "name-error" : undefined}
            />
            {nameError && (
              <p id="name-error" className="mt-1 text-xs text-red-600">
                Please enter your name.
              </p>
            )}
          </label>

          <label className="block" htmlFor="email">
            <span className="text-sm font-medium text-gray-700">Email:</span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              className={`mt-1 block w-full rounded-md border p-2.5 shadow-sm focus:outline-none ${
                emailError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              aria-invalid={emailError}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                Please enter your email.
              </p>
            )}
          </label>
          <label className="block" htmlFor="contact">
            <span className="text-sm font-medium text-gray-700">Contact:</span>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              autoComplete="contact"
              disabled={isSubmitting}
              className={`mt-1 block w-full rounded-md border p-2.5 shadow-sm focus:outline-none ${
                emailError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              aria-invalid={contactError}
              aria-describedby={contactError ? "contact-error" : undefined}
            />
            {contactError && (
              <p id="contact-error" className="mt-1 text-xs text-red-600">
                Please enter your contact number.
              </p>
            )}
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center bg-blue-600 text-white py-2.5 px-4 rounded-lg cursor-pointer hover:bg-blue-700 w-full transition disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                ></span>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
