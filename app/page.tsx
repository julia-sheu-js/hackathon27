
"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type FoodListing = {
  id: string;
  food: string;
  grams: number;
};

function FoodListingsContent() {
  const searchParams = useSearchParams();
  const dashboardHref = `/home?${searchParams.toString()}`;

if (searchParams.get("role") === "charity") {
  return <CharityListings dashboardHref={dashboardHref} />;
}

  const name = searchParams.get("name") || "there";
  const address = searchParams.get("address") || "";
  const storageKey = `foodbridge:listings:${JSON.stringify([name, address])}`;

  return (
    <SchoolListings
      key={storageKey}
      storageKey={storageKey}
      dashboardHref={dashboardHref}
    />
  );
}

function CharityListings({ dashboardHref }: { dashboardHref: string }) {
  const [listings, setListings] = useState<FoodListing[]>([]);

  useEffect(() => {
    const allListings: FoodListing[] = [];
    const prefix = "foodbridge:listings:";

    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith(prefix)) continue;

      const savedListings = localStorage.getItem(key);
      if (savedListings) {
        const schoolListings: FoodListing[] = JSON.parse(savedListings);
        allListings.push(...schoolListings);
      }
    }

    setListings(allListings);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <Link href={dashboardHref} className="font-medium text-green-800">
          Back to Dashboard
        </Link>

        <h1 className="mb-6 mt-4 text-3xl font-bold text-gray-900">
          Browse Food
        </h1>

        {listings.length === 0 ? (
          <p className="text-gray-600">No food listings yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <article
                key={listing.id}
                className="flex aspect-square min-w-0 flex-col justify-center rounded-xl border bg-white p-4 shadow-sm"
              >
                <h2 className="break-words text-lg font-semibold text-gray-900">
                  {listing.food}
                </h2>
                <p className="mt-1 text-gray-600">{listing.grams} g</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SchoolListings({
  storageKey,
  dashboardHref,
}: {
  storageKey: string;
  dashboardHref: string;
}) {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [food, setFood] = useState("");
  const [grams, setGrams] = useState("");

  useEffect(() => {
    const savedListings = localStorage.getItem(storageKey);
    setListings(savedListings ? JSON.parse(savedListings) : []);
  }, [storageKey]);

  function closeForm() {
    setIsFormOpen(false);
    setFood("");
    setGrams("");
  }

  function addListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const foodName = food.trim();
    const weight = Number(grams);

    if (!foodName || !Number.isSafeInteger(weight) || weight < 1) {
      return;
    }

    const updatedListings = [
      ...listings,
      { id: crypto.randomUUID(), food: foodName, grams: weight },
    ];

    localStorage.setItem(storageKey, JSON.stringify(updatedListings));
    setListings(updatedListings);
    closeForm();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <Link href={dashboardHref} className="font-medium text-green-800">
          Back to Dashboard
        </Link>

        <h1 className="mb-6 mt-4 text-3xl font-bold text-gray-900">
          Food Listings
        </h1>

        {isFormOpen && (
          <form
            onSubmit={addListing}
            className="mb-6 flex max-w-md flex-col gap-4 rounded-xl border bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">Add food</h2>

            <label className="flex flex-col gap-1 text-gray-900">
              What food?
              <input
                autoFocus
                required
                value={food}
                onChange={(event) => setFood(event.target.value)}
                className="rounded-lg border px-3 py-2"
                placeholder="e.g. Cooked rice"
              />
            </label>

            <label className="flex flex-col gap-1 text-gray-900">
              How much in grams?
              <input
                type="number"
                min="1"
                step="1"
                required
                value={grams}
                onChange={(event) => setGrams(event.target.value)}
                className="rounded-lg border px-3 py-2"
                placeholder="e.g. 500"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!food.trim() || !grams}
                className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                Done
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            aria-expanded={isFormOpen}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-600 bg-white text-green-800 hover:bg-green-50"
          >
            <span aria-hidden="true" className="text-4xl">+</span>
            <span className="font-semibold">Add listing</span>
          </button>

          {listings.map((listing) => (
            <article
              key={listing.id}
              className="flex aspect-square min-w-0 flex-col justify-center rounded-xl border bg-white p-4 shadow-sm"
            >
              <h2 className="break-words text-lg font-semibold text-gray-900">
                {listing.food}
              </h2>
              <p className="mt-1 text-gray-600">{listing.grams} g</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function FoodListingsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50" />}>
      <FoodListingsContent />
    </Suspense>
  );
}