import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

type Doctor = {
  _id: string;
  name: string;
  email: string;
};

const API = import.meta.env.VITE_API_URL;

const CreateAppointment = () => {
  const [selectOption, setSelectOption] = useState("");
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [reason, setReason] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOption(e.target.value);
  };
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsFetchingDoctors(true);
      try {
        const { data } = await axios.get(`${API}/users/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctorsList(data.doctors);
      } catch (e) {
        console.log("Failed to fetch doctors-list", e);
        toast.error("Failed to fetch doctors-list");
      } finally {
        setIsFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!selectOption || !selectedDate || !selectedTime || !reason) {
      toast.error("Please fill in all the fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const combinedDateTime = new Date(`${selectedDate} ${selectedTime}`);
      const payload = { doctor: selectOption, date: combinedDateTime, reason };
      console.log(payload);

      await axios.post(`${API}/appointments`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Appointment created successfully");
      navigate("/dashboard");
    } catch (e: any) {
      console.log("Failed to to create appointment", e);
      toast.error(e?.response?.data?.message || "Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeSlots = (selectedDate: string) => {
    const slots: string[] = [];

    const startHour = 9;
    const endHour = 20;
    const interval = 30;

    const today = new Date();
    const isToday =
      new Date(selectedDate).toDateString() === today.toDateString();

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += interval) {
        const slot = new Date(selectedDate);
        slot.setHours(hour, min, 0, 0);

        if (isToday && slot <= today) continue;

        const formatted = slot.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });

        slots.push(formatted);
      }
    }
    return slots;
  };

  const showErrors = submitted;
  const doctorError = showErrors && !selectOption;
  const dateError = showErrors && !selectedDate;
  const timeError = showErrors && !selectedTime;
  const reasonError = showErrors && !reason;
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-lg ring-1 ring-black/5">
        <BackButton />
        <h1 className="mt-4 text-center font-semibold text-2xl text-gray-900">
          Create Appointment
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Choose a doctor, pick a date and time, and describe your reason for
          the visit.
        </p>
        <form
          className="flex flex-col gap-5 mt-6"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* doctor list */}
          <label className="block" htmlFor="doctor">
            <span className="text-sm font-medium text-gray-700">Doctor</span>
            <select
              id="doctor"
              value={selectOption}
              onChange={handleOption}
              disabled={isFetchingDoctors || isSubmitting}
              className={`mt-1 block w-full rounded-md border bg-white p-2.5 shadow-sm focus:outline-none ${
                doctorError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              aria-invalid={doctorError}
              aria-describedby={doctorError ? "doctor-error" : undefined}
            >
              <option value="" disabled={isFetchingDoctors}>
                {isFetchingDoctors ? "Loading doctors..." : "Select a doctor"}
              </option>
              {!isFetchingDoctors && doctorsList.length === 0 && (
                <option value="" disabled>
                  No doctors available
                </option>
              )}
              {doctorsList
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((doc) => (
                  <option value={doc._id} key={doc._id}>
                    {doc.name}
                  </option>
                ))}
            </select>
            {doctorError && (
              <p id="doctor-error" className="mt-1 text-xs text-red-600">
                Please select a doctor.
              </p>
            )}
          </label>
          {/* date */}
          <label className="block" htmlFor="date">
            <span className="text-sm font-medium text-gray-700">Date</span>
            <input
              id="date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime("");
              }}
              className={`mt-1 block w-full rounded-md border p-2.5 shadow-sm focus:outline-none ${
                dateError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {dateError && (
              <p id="doctor-error" className="mt-1 text-xs text-red-600">
                Please select a date.
              </p>
            )}
          </label>
          {/* time */}
          <label className="block" htmlFor="time">
            <span className="text-sm font-medium text-gray-700">Time</span>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDate}
              className={`mt-1 block w-full rounded-md border p-2.5 shadow-sm focus:outline-none ${
                timeError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            >
              <option value="">Select Time</option>
              {generateTimeSlots(selectedDate).map((slot, i) => (
                <option key={i} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {timeError && (
              <p id="doctor-error" className="mt-1 text-xs text-red-600">
                Please select a time.
              </p>
            )}
          </label>

          {/* reason */}
          <label className="block" htmlFor="reason">
            <span className="text-sm font-medium text-gray-700">Reason</span>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your concern"
              rows={3}
              maxLength={300}
              disabled={isSubmitting}
              className={`mt-1 block w-full rounded-md border p-2.5 shadow-sm resize-y focus:outline-none ${
                reasonError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              aria-invalid={reasonError}
              aria-describedby={reasonError ? "reason-error" : "reason-help"}
            />
            <div className="mt-1 flex items-center justify-between">
              <p id="reason-help" className="text-xs text-gray-500">
                Up to 300 characters.
              </p>
              <p
                className={`text-xs ${
                  reason.length > 280 ? "text-red-600" : "text-gray-400"
                }`}
              >
                {reason.length}/300
              </p>
            </div>
            {reasonError && (
              <p id="reason-error" className="mt-1 text-xs text-red-600">
                Please provide a reason.
              </p>
            )}
          </label>
          {/* button */}
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
                Creating...
              </span>
            ) : (
              "Create Appointment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
