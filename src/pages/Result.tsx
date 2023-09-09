import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectResult } from "../store/appSlice";

const Result = () => {
  const navigate = useNavigate();
  const result = useAppSelector(selectResult);
  return (
    <div className="w-screen h-screen flex justify-center items-center text-3xl relative">
      {result.status ? (
        <h4>
          Success! Congratulations on Find Falcone. King Shan is mighty pleased.
          <br />
          Time taken: 200
          <br />
          Plant found: {result.planet_name}
        </h4>
      ) : (
        <h4>Failure! King Shan will punish you!</h4>
      )}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 disabled:bg-gray-600 text-white bg-sky-900 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
      >
        Start Again
      </button>
    </div>
  );
};

export default Result;
