export type Driver = {
  id: number;
  name: string;
  vehicleAssigned: boolean;
  followedPlan: boolean;
};

export const initialDrivers: Driver[] = [
  { id: 1, name: "James Anderson", vehicleAssigned: true, followedPlan: true },
  { id: 2, name: "Maria Garcia", vehicleAssigned: true, followedPlan: false },
  { id: 3, name: "Robert Johnson", vehicleAssigned: false, followedPlan: true },
  { id: 4, name: "Linda Martinez", vehicleAssigned: true, followedPlan: true },
  { id: 5, name: "Michael Brown", vehicleAssigned: false, followedPlan: false },
  { id: 6, name: "Sarah Davis", vehicleAssigned: true, followedPlan: true },
  { id: 7, name: "David Wilson", vehicleAssigned: true, followedPlan: false },
  { id: 8, name: "Jennifer Taylor", vehicleAssigned: false, followedPlan: true },
  { id: 9, name: "Christopher Lee", vehicleAssigned: true, followedPlan: true },
  { id: 10, name: "Jessica Thomas", vehicleAssigned: true, followedPlan: true },
  { id: 11, name: "Daniel Harris", vehicleAssigned: false, followedPlan: false },
  { id: 12, name: "Emily Clark", vehicleAssigned: true, followedPlan: true },
];
