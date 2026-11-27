export interface TripBadge {
  icon: 'people' | 'hotel' | 'transfer';
  text: string;
}

export interface TripCostItem {
  id: string;
  label: string;
  amount: string;
  note?: string;
}
