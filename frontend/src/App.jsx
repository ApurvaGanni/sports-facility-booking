import React, { useState } from "react";
import BookingPage from "./pages/BookingPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const [tab, setTab] = useState("booking");

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              SF
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Sports Facility Court Booking
              </p>
              <p className="text-xs text-slate-500">
                Courts • Equipment • Coaches • Dynamic Pricing
              </p>
            </div>
          </div>

          <nav className="flex gap-2 text-xs md:text-sm">
            <button
              onClick={() => setTab("booking")}
              className={`px-3 py-1.5 rounded-full border ${
                tab === "booking"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              Player Booking
            </button>
            <button
              onClick={() => setTab("admin")}
              className={`px-3 py-1.5 rounded-full border ${
                tab === "admin"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              Admin Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="py-6 px-3 md:px-4">
        {tab === "booking" ? <BookingPage /> : <AdminDashboard />}
      </main>

      <footer className="text-center text-xs text-slate-500 py-4">
        Demo app – configure courts, pricing rules, and smart multi-resource booking.
      </footer>
    </div>
  );
}
