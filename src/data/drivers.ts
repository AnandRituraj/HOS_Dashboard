export type Driver = {
  id: number;
  name: string;
  vehicleAssigned: boolean;
  followedPlan: boolean;
  included: boolean;
  vehicleReason: string;
  planReason: string;
  workedDays: { [date: string]: boolean };
};

export const driverNames = [
  "Ahamed Mohamed Faizal",
  "Antoine R",
  "Brinder Singh",
  "David Arden",
  "Deepak NFN",
  "Dhozhi Rei",
  "Dinero",
  "Eric",
  "Hector Joel Batista",
  "Heideckel Toribo (Oscar)",
  "James Austin",
  "Michael Hill",
  "Nunez Robert",
  "Winder Joshua James Jr",
];

export const initialDrivers: Driver[] = driverNames.map((name, i) => ({
  id: i + 1,
  name,
  vehicleAssigned: false,
  followedPlan: false,
  included: true,
  vehicleReason: "",
  planReason: "",
  workedDays: {},
}));
