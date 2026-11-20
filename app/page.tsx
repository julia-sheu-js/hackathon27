
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState<"school" | "charity">("school");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  function handleLogin() {
    if (!name.trim() || !address.trim()) {
      alert("Please enter your organization name and address.");
      return;
    }

    const params = new URLSearchParams({
      role,
      name: name.trim(),
      address: address.trim(),
    });

    router.push(`/home?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <header>
        <h1 className="text-5xl font-bold text-green-900">
          foodbridge
        </h1>
      </header>

      <section className="py-24 px-4 max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-green-900">
          Putting an end to food waste
        </h2>

        <p className="text-xl text-gray-600 mt-6 max-w-2xl">
          A way for cafeterias to redistribute extra food to charities and soup kitchens.
        </p>
      </section>

      <div className="flex flex-col max-w-md gap-4 mx-auto bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900">
          Get started
        </h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "school" | "charity")}
          className="border rounded-lg px-4 py-3"
        >
          <option value="school">I am a school</option>
          <option value="charity">I am a charity</option>
        </select>

        <input
          placeholder="Your organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <input
          placeholder="Your organization address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border rounded-lg px-4 py-3"
        />

        <button
          onClick={handleLogin}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg"
        >
          Log in
        </button>
      </div>
    </main>
  );
}
