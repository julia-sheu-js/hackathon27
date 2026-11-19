'use client';

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Listing = {
  id: number
  school: string
  food: string
  qty_total: number
  qty_avail: number
  safe_until: string
}
type FoodRequest = {
  id: number
  charity: string
  qty_requested: number,
  qty_accepted: number,
  qty_received: number,
  status: 'pending' | 'accepted' | 'collected' | 'rejected'
}

export default function Home(){
  const[role, setRole] = useState<"school" | "charity">('school')
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  return (
      <main style={{margin: 0, padding: 16}}>
        <header>
          <h1 style={{fontSize: 48, fontWeight: "bold", color: "darkgreen"}}>
            foodbridge
          </h1>

        </header>
        
        <section style={{padding: "100px 40px"}}>
          <h2 style={{fontSize: 56, fontWeight: "bold", color: "darkgreen"}}>
            Putting an end to food waste
          </h2>

          <p style={{fontSize: 22, color: "dimgray", marginTop: 16}}>
            A way for cafeterias to redistribute extra food to charities and soup kitchens.
          </p>
        </section>

        <div style={{display: "flex", flexDirection: "column", maxWidth: 400, gap: 12, margin: "0 auto"}}>
          <select
            value = {role}
              onChange = {e => setRole(e.target.value as "school" | "charity")}
            >
            <option value="school">I am a school</option>
            <option value = "charity">I am a charity</option>
          </select>
          <input placeholder = "Your organization name" value = {name} onChange = {e=>setName(e.target.value)}/>
          <input placeholder="Your organization address" value={address} onChange={e => setAddress(e.target.value)}/>
          <button style={{backgroundColor: "seagreen", color: "white", padding: 12, borderRadius: 8}}>
            Log in
          </button>

        </div>
    
    {role === "school" ? 
      (
      <section>
        <h2>Surplus Food</h2>
        <h2>Food Requests</h2>
      </section>
      ):
      (
        <section>
        <h2>Available Food</h2>
        <h2>My Requests</h2>
        </section>
      )
    
      
    }
    
    </main>
  )
}