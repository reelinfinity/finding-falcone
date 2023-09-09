export type Planet = {
  name: string;
  distance: number;
};

export type Vehicle = {
  name: string;
  total_no: number;
  max_distance: number;
  speed: number;
};

export type Destination = Planet & {
  timeTaken: number;
  selectedVehicle: string;
};
