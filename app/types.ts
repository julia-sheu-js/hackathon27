export type Role = "school" | "charity";

export type Profile = {
  id: string;
  organization_name: string;
  organization_type: Role;
};

export type FoodListing = {
  id: string;
  school_id: string;
  school_name: string;
  food_name: string;
  category: string;
  total_quantity: number;
  unit: string;
  description: string;
  allergens: string;
  collection_deadline: string; // ISO date
  status: "available" | "fully_claimed";
};

export type FoodRequest = {
  id: string;
  listing_id: string;
  charity_id: string;
  charity_name: string;
  requested_quantity: number;
  approved_quantity: number;
  status: "pending" | "approved" | "declined";
};