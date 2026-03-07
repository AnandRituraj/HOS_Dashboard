export type DayEntry = {
  vehicleAssigned: boolean;
  followedPlan: boolean;
  vehicleReason: string;
  planReason: string;
};

export type Driver = {
  id: number;
  name: string;
  workedDays: { [date: string]: boolean };
  days: { [date: string]: DayEntry };
};

export function emptyDay(): DayEntry {
  return {
    vehicleAssigned: false,
    followedPlan: false,
    vehicleReason: "",
    planReason: "",
  };
}

export const driverNames = [
  "Ahamed Mohamed Faizal",
  "Brinder Singh",
  "David Arden",
  "Deepak NFN",
  "Dhozhi Rei",
  "Dinero",
  "Eric",
  "Hector Joel Batista",
  "Heideckel Toribo ( Oscar)",
  "Michael",
  "NUNEZ ROBERT",
  "Ramon Sierra",
  "Raymond Rodriguez",
  "Winder Joshua James, JR",
];

export const initialDrivers: Driver[] = driverNames.map((name, i) => ({
  id: i + 1,
  name,
  workedDays: {},
  days: {},
}));
