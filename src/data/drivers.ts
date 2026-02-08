export type Driver = {
  id: number;
  name: string;
  vehicleAssigned: boolean;
  followedPlan: boolean;
  included: boolean;
  vehicleReason: string;
  planReason: string;
};

export const initialDrivers: Driver[] = [
  { id: 1, name: "James Anderson", vehicleAssigned: true, followedPlan: true, included: true, vehicleReason: "", planReason: "" },
  { id: 2, name: "Maria Garcia", vehicleAssigned: true, followedPlan: false, included: true, vehicleReason: "", planReason: "Route was changed last minute" },
  { id: 3, name: "Robert Johnson", vehicleAssigned: false, followedPlan: true, included: true, vehicleReason: "Vehicle was in maintenance", planReason: "" },
  { id: 4, name: "Linda Martinez", vehicleAssigned: true, followedPlan: true, included: true, vehicleReason: "", planReason: "" },
  { id: 5, name: "Michael Brown", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "No vehicle available", planReason: "Personal emergency" },
  { id: 6, name: "Sarah Davis", vehicleAssigned: true, followedPlan: true, included: true, vehicleReason: "", planReason: "" },
  { id: 7, name: "David Wilson", vehicleAssigned: true, followedPlan: false, included: true, vehicleReason: "", planReason: "Traffic detour required" },
  { id: 8, name: "Jennifer Taylor", vehicleAssigned: false, followedPlan: true, included: true, vehicleReason: "Assigned to different task", planReason: "" },
  { id: 9, name: "Christopher Lee", vehicleAssigned: true, followedPlan: true, included: true, vehicleReason: "", planReason: "" },
  { id: 10, name: "Jessica Thomas", vehicleAssigned: true, followedPlan: true, included: true, vehicleReason: "", planReason: "" },
  { id: 11, name: "Daniel Harris", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "License expired", planReason: "Called in sick" },
  { id: 12, name: "Emily Clark", vehicleAssigned: true, followedPlan: true, included: true, vehicleReason: "", planReason: "" },
];
