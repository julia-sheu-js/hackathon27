"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FoodListing, FoodRequest, Profile, Role } from "@/app/types";

const profiles: Record<Role, Profile> = {
  school: { id: "s1", organization_name: "SAS", organization_type: "school" },
  charity: { id: "c1", organization_name: "Community Table SG", organization_type: "charity" },
};

const seedListings: FoodListing[] = [
  {
    id: "f1",
    school_id: "s1",
    school_name: "sas",
    food_name: "Vegetarian fried rice",
    category: "Rice & noodles",
    total_quantity: 50,
    unit: "portions",
    description: "Packed in sealed catering trays.",
    allergens: "Soy; may contain egg",
    collection_deadline: new Date(Date.now() + 5 * 3600000).toISOString(),
    status: "available",
  },
  {
    id: "f2",
    school_id: "s1",
    school_name: "sas",
    food_name: "Seasonal fruit cups",
    category: "Fruit",
    total_quantity: 36,
    unit: "cups",
    description: "Assorted cut fruit in sealed cups.",
    allergens: "None declared",
    collection_deadline: new Date(Date.now() + 3 * 3600000).toISOString(),
    status: "available",
  },
];

type Store = {
  role: Role;
  setRole: (r: Role) => void;
  profile: Profile;
  listings: FoodListing[];
  requests: FoodRequest[];
  createListing: (data: Partial<FoodListing>) => void;
  requestFood: (listingId: string, qty: number) => void;
  decideRequest: (id: string, approve: boolean) => void;
};

const Ctx = createContext<Store | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("school");
  const [listings, setListings] = useState<FoodListing[]>(seedListings);
  const [requests, setRequests] = useState<FoodRequest[]>([]);

  useEffect(() => {
    try {
      const l = localStorage.getItem("fb-listings");
      const r = localStorage.getItem("fb-requests");
      if (l) setListings(JSON.parse(l));
      if (r) setRequests(JSON.parse(r));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("fb-listings", JSON.stringify(listings));
  }, [listings]);
  useEffect(() => {
    localStorage.setItem("fb-requests", JSON.stringify(requests));
  }, [requests]);

  const value = useMemo<Store>(
    () => ({
      role,
      setRole,
      profile: profiles[role],
      listings,
      requests,
      createListing(data) {
        const p = profiles[role];
        if (p.organization_type !== "school") return;
        setListings((old) => [
          {
            id: crypto.randomUUID(),
            school_id: p.id,
            school_name: p.organization_name,
            food_name: data.food_name || "Untitled",
            category: data.category || "Other",
            total_quantity: Number(data.total_quantity) || 1,
            unit: data.unit || "portions",
            description: data.description || "",
            allergens: data.allergens || "",
            collection_deadline:
              data.collection_deadline || new Date(Date.now() + 4 * 3600000).toISOString(),
            status: "available",
          },
          ...old,
        ]);
      },
      requestFood(listingId, qty) {
        const p = profiles[role];
        if (p.organization_type !== "charity" || qty <= 0) return;
        setRequests((old) => [
          {
            id: crypto.randomUUID(),
            listing_id: listingId,
            charity_id: p.id,
            charity_name: p.organization_name,
            requested_quantity: qty,
            approved_quantity: 0,
            status: "pending",
          },
          ...old,
        ]);
      },
      decideRequest(id, approve) {
        setRequests((old) =>
          old.map((r) =>
            r.id === id && r.status === "pending"
              ? {
                  ...r,
                  status: approve ? "approved" : "declined",
                  approved_quantity: approve ? r.requested_quantity : 0,
                }
              : r
          )
        );
      },
    }),
    [role, listings, requests]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFB() {
  const v = useContext(Ctx);
  if (!v) throw new Error("providers missing");
  return v;
}