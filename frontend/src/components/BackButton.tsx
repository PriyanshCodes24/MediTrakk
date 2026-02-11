import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(-1);
      }}
      className="flex text-gray-500 items-center text-sm hover:underline cursor-pointer"
    >
      <IoIosArrowBack className="mr-1" />
      Back
    </button>
  );
};

export default BackButton;
