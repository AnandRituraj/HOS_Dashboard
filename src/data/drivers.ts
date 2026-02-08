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
  { id: 1, name: "Anand Rituraj", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 2, name: "Antoine R", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 3, name: "Brinder Singh", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 4, name: "Camaron Donald Edeard", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 5, name: "David Arden", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 6, name: "Deepak NFN", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 7, name: "Dhozhi Rei", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 8, name: "Dinero", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 9, name: "Eric", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 10, name: "Fresly", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 11, name: "Hector Joel Batista", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 12, name: "Heideckel Toribo (Oscar)", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 13, name: "Jay", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 14, name: "James Austin", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 15, name: "Michael Hill", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 16, name: "Nunez Robert", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  { id: 17, name: "Winder Joshua James Jr", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
];
