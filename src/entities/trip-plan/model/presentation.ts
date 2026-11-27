export interface TripPlanField {
  label: string;
  value: string;
  note?: string;
}

export interface TripPlanTraveler {
  id: string;
  label: string;
  description: string;
  isChild?: boolean;
}
