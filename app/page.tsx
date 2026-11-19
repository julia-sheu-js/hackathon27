
'use client';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";

function HomeContent() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "there";
  const address = searchParams.get("address") || "";

  const role = searchParams.get("role") === "charity" ? "charity" : "school";
  const [listings, setListings] = useState<{ id: string }[]>([]);
  const listingCount = listings.length;
  const storageKey = `foodbridge:listings:${JSON.stringify([name, address])}`;

  useEffect(() => {
    if (role === "school") {
      const savedListings = localStorage.getItem(storageKey);
      setListings(savedListings ? JSON.parse(savedListings) : []);
    }
  }, [role, storageKey]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar role={role} 
      foodListingsHref={`/food-listings?${searchParams.toString()}`}
      />

      <div className="max-w-6xl mx-auto px-8 py-10">
        <section className="mb-8">
          <p className="text-sm text-green-700 font-medium">
            FOODBRIDGE DASHBOARD
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Welcome, {name}!
          </h1>

          <p className="text-gray-500 mt-2">
            {role === "school"
              ? "Manage your surplus food."
              : "Discover available food."}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {address}
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm">
              {role === "school" ? "Food Listings" : "Available Listings"}
            </p>
            <h2 className="text-3xl font-bold text-green-800 mt-2">
              {role === "school" ? listingCount : 0}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm">
              {role === "school" ? "Food Donated" : "Food Received"}
            </p>
            <h2 className="text-3xl font-bold text-green-800 mt-2">
              0
            </h2>
          </div>
        </div>

        {role === "school" && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">Updates</h2>

            {[...listings].reverse().map((listing) => (
            <p key={listing.id} className="mt-2 text-gray-600">
              Listing has been added.
            </p>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50" />}>
      <HomeContent />
    </Suspense>
  );
}
