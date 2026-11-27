export interface TripPlanBadge {
  icon: 'people' | 'hotel' | 'transfer';
  text: string;
}

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

export interface TripPlanCostItem {
  id: string;
  label: string;
  amount: string;
  note?: string;
}
