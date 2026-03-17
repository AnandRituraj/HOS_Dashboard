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
