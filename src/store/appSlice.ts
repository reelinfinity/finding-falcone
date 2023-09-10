import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { fetchPlanets, fetchResult, fetchToken, fetchVehicles } from "./appAPI";
import { Destination, Planet, Vehicle } from "../types";

export interface AppState {
  planets: Planet[];
  vehicles: Vehicle[];
  destinations: Destination[];
  availableVehicles: Vehicle[];
  status: "idle" | "loading" | "failed";
  token: string;
  result: {
    planet_name: string;
    status: boolean;
  };
}

const initialState: AppState = {
  planets: [],
  vehicles: [],
  status: "idle",
  availableVehicles: [],
  destinations: new Array<Destination>(4).fill({
    name: "Select",
    distance: 0,
    timeTaken: 0,
    selectedVehicle: "",
  }),
  token: "",
  result: {
    planet_name: "",
    status: false,
  },
};
export const getPlanets = createAsyncThunk("app/getPlanets", async () => {
  const data = await fetchPlanets();
  return data;
});

export const getVehicles = createAsyncThunk("app/getVehicles", async () => {
  const data = await fetchVehicles();
  return data;
});

export const getToken = createAsyncThunk("app/getToken", async () => {
  const data = await fetchToken();
  return data;
});

export const getResult = createAsyncThunk(
  "app/result",
  async (_args, { getState }) => {
    const state = getState();
    const data = await fetchResult(
      (
        state as {
          app: AppState;
        }
      ).app.destinations,
      (
        state as {
          app: AppState;
        }
      ).app.token
    );
    return data;
  }
);

export const appReducer = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAvailableVehicles: (state: AppState) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tempVehicles: any = {};
      state.destinations.forEach((destination) => {
        if (destination.selectedVehicle) {
          const vehicle = destination.selectedVehicle;
          tempVehicles[vehicle] = tempVehicles[vehicle]
            ? tempVehicles[vehicle] + 1
            : 1;
        }
      });
      state.availableVehicles = state.vehicles.map((vehicle) => {
        if (tempVehicles[vehicle.name] === undefined) {
          return vehicle;
        } else if (vehicle.total_no - tempVehicles[vehicle.name] > 0)
          return {
            ...vehicle,
            total_no: vehicle.total_no - tempVehicles[vehicle.name],
          };
        else
          return {
            ...vehicle,
            total_no: 0,
          };
      });
    },
    modifySelectedDestination: (
      state: AppState,
      action: PayloadAction<{ selectedIndex: number; planet: Planet }, string>
    ) => {
      const { selectedIndex, planet } = action.payload;
      if (state.destinations[selectedIndex].name === "Select") {
        state.destinations[selectedIndex] = {
          ...state.destinations[selectedIndex],
          ...planet,
        };
        state.planets = state.planets.filter(
          (planetI) => planet.name !== planetI.name
        );
      } else {
        state.planets = [
          ...state.planets,
          {
            name: state.destinations[selectedIndex].name,
            distance: state.destinations[selectedIndex].distance,
          },
        ];
        state.destinations[selectedIndex] = {
          ...state.destinations[selectedIndex],
          ...planet,
        };
        state.planets = state.planets.filter(
          (planetI) => planet.name !== planetI.name
        );
      }
    },
    addVehicleRelatedInfo: (
      state: AppState,
      action: PayloadAction<
        { timeTaken: number; selectedVehicle: string; selectedIndex: number },
        string
      >
    ) => {
      const { timeTaken, selectedIndex, selectedVehicle } = action.payload;
      state.destinations[selectedIndex] = {
        ...state.destinations[selectedIndex],
        timeTaken: timeTaken,
        selectedVehicle: selectedVehicle,
      };
    },
    removeSelectedDestinations: (state: AppState) => {
      state.destinations = new Array<Destination>(4).fill({
        name: "Select",
        distance: 0,
        timeTaken: 0,
        selectedVehicle: "",
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlanets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPlanets.fulfilled, (state, action) => {
        state.status = "idle";
        state.planets = action.payload;
      })
      .addCase(getPlanets.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVehicles.fulfilled, (state, action) => {
        state.status = "idle";
        state.vehicles = action.payload;
      })
      .addCase(getVehicles.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.status = "idle";
        state.token = action.payload;
      })
      .addCase(getToken.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getResult.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getResult.fulfilled, (state, action) => {
        state.status = "idle";
        state.result = action.payload;
      })
      .addCase(getResult.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectPlanets = (state: RootState) => state.app.planets;

export const selectVehicles = (state: RootState) => state.app.vehicles;

export const selectDestinations = (state: RootState) => state.app.destinations;

export const selectToken = (state: RootState) => state.app.token;

export const selectResult = (state: RootState) => state.app.result;

export const selectAvailableVehicles = (state: RootState) =>
  state.app.availableVehicles;

export const {
  modifySelectedDestination,
  addVehicleRelatedInfo,
  setAvailableVehicles,
  removeSelectedDestinations,
} = appReducer.actions;

export default appReducer.reducer;
