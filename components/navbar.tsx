
"use client";

import Link from "next/link";

type NavbarProps = {
  role: "school" | "charity";
  foodListingsHref: string;
};

export default function Navbar({ role, foodListingsHref }: NavbarProps) {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">

      <h1 className="text-2xl font-bold text-green-800">
        foodbridge
      </h1>

      <div className="flex items-center gap-6">

        <Link href={foodListingsHref} className="text-gray-600 hover:text-green-500">
          {role === "school" ? "Food Listings" : "Browse Food"}
        </Link>

      </div>
    </nav>
  );
}
