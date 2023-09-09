import { useEffect } from "react";
import Destinations from "../components/Destinations";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  getPlanets,
  getResult,
  getToken,
  getVehicles,
  removeSelectedDestinations,
  selectDestinations,
} from "../store/appSlice";
import Vehicles from "../components/Vehicles";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const destinations = useAppSelector(selectDestinations);
  const dispatch = useAppDispatch();
  const totalTimeTaken = () =>
    destinations.reduce((curr, acc) => acc.timeTaken + curr, 0);

  const disableSubmit = () =>
    !!destinations.find((planet) => planet.selectedVehicle === "");

  useEffect(() => {
    dispatch(getPlanets());
    dispatch(getVehicles());
    dispatch(getToken());
  }, [dispatch]);
  return (
    <div className="h-full w-full flex flex-col items-center font-mono space-y-3 max">
      <h1 className="text-4xl text-teal-600">Finding Falcone!</h1>
      <h2 className="text-3xl text-teal-600">
        Select planets you want to search in:
      </h2>

      <div className="flex space-x-4">
        {destinations.map((planet, index) => (
          <div className="flex flex-col" key={index}>
            <h6 className="text-teal-600">{`Destination ${index + 1}`}</h6>
            <Destinations selectedPlanet={planet} selectedIndex={index} />
            {planet.name !== "Select" && (
              <Vehicles selectedPlanet={planet} selectedIndex={index} />
            )}
          </div>
        ))}
      </div>
      <button
        disabled={disableSubmit()}
        onClick={() => {
          dispatch(getResult());
          dispatch(removeSelectedDestinations());
          navigate("/result");
        }}
        type="button"
        className="absolute bottom-10 disabled:bg-gray-600 text-white bg-sky-900 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
      >
        Find Falcone
      </button>
      <h1 className="absolute bottom-5 right-2 text-5xl">
        Time Taken: {totalTimeTaken()}
      </h1>
    </div>
  );
}

export default App;
