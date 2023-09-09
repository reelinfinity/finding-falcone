import { Destination, Planet, Vehicle } from "../types";

export const API_SERVER = "https://findfalcone.geektrust.com";

export async function fetchPlanets(): Promise<Planet[]> {
  try {
    const response = await fetch(`${API_SERVER}/planets`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const response = await fetch(`${API_SERVER}/vehicles`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchToken(): Promise<string> {
  try {
    const response = await fetch(`${API_SERVER}/token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export const fetchResult: (
  destinations: Destination[],
  token: string
) => Promise<{ planet_name: string; status: boolean }> = async (
  destinations,
  token
) => {
  const planet_names: string[] = [];
  const vehicle_names: string[] = [];
  destinations.forEach((planet) => {
    planet_names.push(planet.name);
    vehicle_names.push(planet.selectedVehicle);
  });
  try {
    const response = await fetch(`${API_SERVER}/find`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        planet_names,
        vehicle_names,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
