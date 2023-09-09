import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addVehicleRelatedInfo,
  selectAvailableVehicles,
  setAvailableVehicles,
} from "../store/appSlice";
import { Destination } from "../types";

interface VehiclesProps {
  selectedPlanet: Destination;
  selectedIndex: number;
}

export default function Vehicles({
  selectedPlanet,
  selectedIndex,
}: VehiclesProps) {
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector(selectAvailableVehicles);
  const [selected, setSelected] = useState("");
  const getIsRangeLess = (vehicleMaxDistance: number) =>
    selectedPlanet.distance > vehicleMaxDistance;

  return (
    <div className="relative w-full py-16">
      <div className="relative w-full">
        <RadioGroup value={selected} onChange={setSelected}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
            {vehicles.map((vehicle) => (
              <RadioGroup.Option
                key={vehicle.name}
                disabled={
                  vehicle.total_no === 0 || getIsRangeLess(vehicle.max_distance)
                }
                value={vehicle.name}
                onClick={() => {
                  const distance = selectedPlanet.distance;
                  const speed = vehicle ? vehicle.speed : 1;
                  const time = distance / speed;
                  dispatch(
                    addVehicleRelatedInfo({
                      timeTaken: time,
                      selectedVehicle: vehicle.name,
                      selectedIndex,
                    })
                  );
                  dispatch(setAvailableVehicles());
                }}
                className={({ active, checked }) =>
                  `
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                  }
                  ${
                    (vehicle.total_no === 0 ||
                      getIsRangeLess(vehicle.max_distance)) &&
                    !active &&
                    !checked
                      ? "bg-gray-200"
                      : ""
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {vehicle.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-sky-100" : "text-gray-500"
                            }`}
                          >
                            <h6>Total Units: {vehicle.total_no}</h6>
                            <h6>Max Distance: {vehicle.max_distance}</h6>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function CheckIcon(props: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
