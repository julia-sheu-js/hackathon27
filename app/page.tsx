"use client";

import { useEffect, useState } from "react";
import { Providers, useFB } from "@/app/components/providers";
import type { FoodListing } from "@/app/types";

const pill: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  fully_claimed: "bg-gray-200 text-gray-600",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-700",
};

export default function Home() {
  return (
    <Providers>
      <Dashboard />
    </Providers>
  );
}

function Dashboard() {
  const { role, setRole, profile, listings, requests, createListing, requestFood, decideRequest } =
    useFB();
  const [tab, setTab] = useState<"food" | "requests">("food");
  const [showForm, setShowForm] = useState(false);

  const isSchool = role === "school";
  const myListings = isSchool ? listings.filter((l) => l.school_id === profile.id) : listings;
  const myRequests = isSchool
    ? requests.filter((r) => myListings.some((l) => l.id === r.listing_id))
    : requests.filter((r) => r.charity_id === profile.id);

  const claimed = (listingId: string) =>
    requests
      .filter((r) => r.listing_id === listingId && r.status === "approved")
      .reduce((s, r) => s + r.approved_quantity, 0);
  const donated = myListings.reduce((s, l) => s + claimed(l.id), 0);
  const pending = myRequests.filter((r) => r.status === "pending").length;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
        <span className="text-xl font-bold text-green-800">FoodBridge</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "school" | "charity")}
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          <option value="school">School</option>
          <option value="charity">Charity</option>
        </select>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-bold">{profile.organization_name}</h1>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Stat label={isSchool ? "My Listings" : "available"} value={myListings.length} />
          <Stat label={isSchool ? "Portions donated" : "portions Received"} value={donated} />
          <Stat label="Pending Requests" value={pending} />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            <Tab active={tab === "food"} onClick={() => setTab("food")}>
              {isSchool ? "Surplus Food" : "Browse Food"}
            </Tab>
            <Tab active={tab === "requests"} onClick={() => setTab("requests")}>
              {isSchool ? "Incoming Requests" : "My Requests"}
            </Tab>
          </div>
          {isSchool && tab === "food" && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              {showForm ? "Cancel" : "+ New Listing"}
            </button>
          )}
        </div>

        {showForm && isSchool && (
          <ListingForm
            onSubmit={(d) => {
              createListing(d);
              setShowForm(false);
            }}
          />
        )}

        {tab === "food" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {myListings.map((l) => (
              <Card key={l.id} l={l} left={l.total_quantity - claimed(l.id)} onRequest={requestFood} showRequest={!isSchool} />
            ))}
            {!myListings.length && <p className="text-gray-500">No food listed yet.</p>}
          </div>
        ) : (
          <table className="mt-4 w-full rounded-xl border bg-white text-left text-sm shadow-sm">
            <thead className="border-b bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3">Food</th>
                <th className="px-4 py-3">{isSchool ? "Charity" : "Requested"}</th>
                {isSchool && <th className="px-4 py-3">Qty</th>}
                <th className="px-4 py-3">Status</th>
                {isSchool && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {myRequests.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {listings.find((l) => l.id === r.listing_id)?.food_name || "—"}
                  </td>
                  <td className="px-4 py-3">{isSchool ? r.charity_name : r.requested_quantity}</td>
                  {isSchool && <td className="px-4 py-3">{r.requested_quantity}</td>}
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${pill[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  {isSchool && (
                    <td className="px-4 py-3">
                      {r.status === "pending" ? (
                        <span className="flex gap-2">
                          <button
                            onClick={() => decideRequest(r.id, true)}
                            className="rounded bg-green-700 px-3 py-1 text-xs text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => decideRequest(r.id, false)}
                            className="rounded border px-3 py-1 text-xs"
                          >
                            Decline
                          </button>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {!myRequests.length && (
                <tr>
                  <td colSpan={isSchool ? 5 : 3} className="px-4 py-6 text-center text-gray-500">
                    No requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-green-800">{value}</p>
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${
        active ? "bg-green-100 text-green-800" : "text-gray-600 hover:text-green-700"
      }`}
    >
      {children}
    </button>
  );
}

function Card({
  l,
  left,
  onRequest,
  showRequest,
}: {
  l: FoodListing;
  left: number;
  onRequest: (id: string, qty: number) => void;
  showRequest: boolean;
}) {
  const [qty, setQty] = useState("");
  const [hours, setHours] = useState<number | null>(null);
  useEffect(() => {
    setHours(Math.max(0, Math.round((new Date(l.collection_deadline).getTime() - Date.now()) / 3600000)));
  }, [l.collection_deadline]);
  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">{l.category}</p>
          <h3 className="mt-0.5 font-semibold">{l.food_name}</h3>
          <p className="text-sm text-gray-500">{l.school_name}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${pill[l.status]}`}>{l.status.replace("_", " ")}</span>
      </div>
      {l.description && <p className="mt-2 text-sm text-gray-600">{l.description}</p>}
      {l.allergens && <p className="mt-1 text-xs text-gray-500"><b>Allergens:</b> {l.allergens}</p>}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <span>{left} {l.unit} left · collect within {hours ?? "-"}h</span>
        {showRequest && left > 0 && (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const n = Number(qty);
              if (n > 0 && n <= left) {
                onRequest(l.id, n);
                setQty("");
              }
            }}
          >
            <input
              type="number"
              min={1}
              max={left}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Qty"
              className="w-16 rounded border px-2 py-1 text-sm"
              required
            />
            <button className="rounded bg-green-700 px-3 py-1 text-sm text-white hover:bg-green-600">
              Request
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

function ListingForm({ onSubmit }: { onSubmit: (d: Partial<FoodListing>) => void }) {
  const [f, setF] = useState({
    food_name: "",
    category: "Rice & noodles",
    total_quantity: "",
    unit: "portions",
    description: "",
    allergens: "",
    collection_deadline: "",
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const input = "w-full rounded-lg border px-3 py-2 text-sm";
  return (
    <form
      className="mt-4 grid grid-cols-1 gap-4 rounded-xl border bg-white p-6 shadow-sm md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...f, total_quantity: Number(f.total_quantity), collection_deadline: new Date(f.collection_deadline).toISOString() });
      }}
    >
      <label className="text-sm"><span className="mb-1 block font-medium">Food name</span>
        <input required value={f.food_name} onChange={(e) => set("food_name", e.target.value)} className={input} />
      </label>
      <label className="text-sm"><span className="mb-1 block font-medium">Category</span>
        <select value={f.category} onChange={(e) => set("category", e.target.value)} className={input}>
          {["Rice & noodles", "Prepared meals", "Vegetables", "Fruit", "Bread & bakery", "Other"].map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label className="text-sm"><span className="mb-1 block font-medium">Quantity</span>
        <input required type="number" min="1" value={f.total_quantity} onChange={(e) => set("total_quantity", e.target.value)} className={input} />
      </label>
      <label className="text-sm"><span className="mb-1 block font-medium">Unit</span>
        <select value={f.unit} onChange={(e) => set("unit", e.target.value)} className={input}>
          {["portions", "kg", "boxes", "trays", "cups"].map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label className="text-sm"><span className="mb-1 block font-medium">Collection deadline</span>
        <input required type="datetime-local" value={f.collection_deadline} onChange={(e) => set("collection_deadline", e.target.value)} className={input} />
      </label>
      <label className="text-sm"><span className="mb-1 block font-medium">Allergens</span>
        <input value={f.allergens} onChange={(e) => set("allergens", e.target.value)} className={input} />
      </label>
      <label className="text-sm md:col-span-2"><span className="mb-1 block font-medium">Description</span>
        <textarea value={f.description} onChange={(e) => set("description", e.target.value)} className={input} rows={2} />
      </label>
      <div className="md:col-span-2">
        <button className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
          Publish listing
        </button>
      </div>
    </form>
  );
}