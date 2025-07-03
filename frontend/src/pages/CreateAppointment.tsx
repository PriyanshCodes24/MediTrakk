import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Doctor = {
  _id: string;
  name: string;
  email: string;
};

const API = import.meta.env.VITE_API_URL;

const CreateAppointment = () => {
  const [selectOption, setSelectOption] = useState("");
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  //   const [loadingDoctors, setLoadingDoctors] = useState(true);

  const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOption(e.target.value);
    console.log(selectOption);
  };
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${API}/users/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctorsList(data.doctors);
        console.log(data.doctors);
      } catch (e) {
        console.log("Failed to fetch doctors-list", e);
      } finally {
        // setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectOption || !date || !time || !reason) {
      return toast.error("Please fill in all the fields");
    }

    const [year, month, day] = date.split("-");
    const formattedDate = `${day}-${month}-${year}`;

    try {
      const { data } = await axios.post(
        `${API}/appointments`,
        { doctor: selectOption, date: formattedDate, time, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      toast.success("Appointment created successfully");
      navigate("/dashboard");
    } catch (e) {
      console.log("Failed to to create appointment", e);
      toast.error("something went wrong");
    }
  };
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-center font-bold text-xl mb-4">
          Create Appointment
        </h1>
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700">Select a Doctor</span>
            <select
              value={selectOption}
              onChange={handleOption}
              className="mt-1 block w-full rounded-md border bg-white border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Doctors</option>
              {doctorsList.map((doc) => (
                <option value={doc._id} key={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Select Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block mt-1 border border-gray-300 p-2 shadow-sm rounded-md w-full focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Select Time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
              }}
              className="block mt-1 border border-gray-300 w-full rounded-full p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Reason</span>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="block mt-1 border border-gray-300 w-full rounded-full p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 w-full transition"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
