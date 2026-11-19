
"use client";

type NavbarProps = {
  role: "school" | "charity";
  setRole: (role: "school" | "charity") => void;
};

export default function Navbar({ role, setRole }: NavbarProps) {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">

      <h1 className="text-2xl font-bold text-green-800">
        foodbridge
      </h1>

      <div className="flex items-center gap-6">

        <button className="text-gray-600 hover:text-green-600">
          dashboard
        </button>

        <button className="text-gray-600 hover:text-green-500">
          {role === "school" ? "Food Listings" : "Browse Food"}
        </button>

        <button className="text-gray-600 hover:text-green-400">
          {role === "school" ? "Requests" : "My Requests"}
        </button>

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "school" | "charity")
          }
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="school">school</option>
          <option value="charity">Charity</option>
        </select>

      </div>
    </nav>
  );
}
