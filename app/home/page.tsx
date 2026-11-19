
'use client';

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";

function HomeContent() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "there";
  const address = searchParams.get("address") || "";

  const initialRole =
    searchParams.get("role") === "charity" ? "charity" : "school";

  const [role, setRole] = useState<"school" | "charity">(initialRole);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar role={role} setRole={setRole} />

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
              ? "Manage your surplus food and donation requests."
              : "Discover available food and manage your requests."}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {address}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm">
              {role === "school" ? "Food Listings" : "Available Listings"}
            </p>
            <h2 className="text-3xl font-bold text-green-800 mt-2">0</h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm">
              {role === "school" ? "Food Donated" : "Food Received"}
            </p>
            <h2 className="text-3xl font-bold text-green-800 mt-2">0</h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Pending Requests
            </p>
            <h2 className="text-3xl font-bold text-green-800 mt-2">0</h2>
          </div>
        </div>

        {role === "school" ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">
              Surplus Food
            </h2>

            <h2 className="text-xl font-bold text-gray-900 mt-8">
              Food Requests
            </h2>
          </section>
        ) : (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">
              Available Food
            </h2>

            <h2 className="text-xl font-bold text-gray-900 mt-8">
              My Requests
            </h2>
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
