import { useState } from "react";

const CreateAppointment = () => {
  const [selectOption, setSelectOption] = useState("");
  const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOption(e.target.value);
  };
  console.log(selectOption);
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-center font-bold text-xl mb-4">
          Create Appointment
        </h1>
        <form className="flex flex-col gap-4 mt-4">
          <label className="block">
            <span className="text-gray-700">
              <select
                value={selectOption}
                onChange={handleOption}
                className="mt-1 block w-full rounded-md border bg-white border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">-- Select --</option>
                <option value="op-1">op-1</option>
              </select>
            </span>
          </label>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
