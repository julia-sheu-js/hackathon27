'use client';

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
type listings = {
  id: number
  school: string
  food: string
  qty_total: number
  qty_avail: number
  safe_until: string
}
type requests = {
  id: Number
  charity: string
  qty_requested: number,
  qty_accepted: number,
  qty_received: number,
  status: 'pending' | 'accepted' | 'collected' | 'rejected'
}

export default function Home(){
  const[role, setRole] = useState<"school" | "charity">('school')
  const [name, setName] = useState("")

  return (
    <main style={{maxWidth: 700, margin: '20px auto', padding: 16}}>
      <h1>Hackathon</h1>

      <select>
        <option value="school">I am a school</option>
        <option value = "charity">I am a charity</option>
      </select>
      <input placeholder = "Your organization name" value = {name} onChange = {e=>setName(e.target.value)}/>
    
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