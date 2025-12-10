import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AdminDashboard() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [rules, setRules] = useState([]);

  const [courtForm, setCourtForm] = useState({
    name: "",
    type: "indoor",
    basePrice: 400
  });

  const [ruleForm, setRuleForm] = useState({
    name: "",
    type: "weekend",
    weekendSurcharge: 100,
    startHour: 18,
    endHour: 21,
    multiplier: 1.5,
    courtType: "indoor",
    courtTypeSurcharge: 50,
    fixedSurcharge: 0
  });

  const [coachForm, setCoachForm] = useState({
    name: "",
    sport: "badminton"
  });

  useEffect(() => {
    refreshAll();
  }, []);

  async function refreshAll() {
    const [cRes, coachRes, rRes] = await Promise.all([
      axios.get(`${API_BASE}/api/courts`),
      axios.get(`${API_BASE}/api/coaches`),
      axios.get(`${API_BASE}/api/pricing-rules`)
    ]);
    setCourts(cRes.data);
    setCoaches(coachRes.data);
    setRules(rRes.data);
  }

  async function handleCourtSubmit(e) {
    e.preventDefault();
    await axios.post(`${API_BASE}/api/courts/admin`, courtForm);
    setCourtForm({ name: "", type: "indoor", basePrice: 400 });
    await refreshAll();
  }

  async function handleRuleSubmit(e) {
    e.preventDefault();
    await axios.post(`${API_BASE}/api/pricing-rules/admin`, ruleForm);
    setRuleForm({
      ...ruleForm,
      name: ""
    });
    await refreshAll();
  }

  async function handleCoachSubmit(e) {
    e.preventDefault();
    await axios.post(`${API_BASE}/api/coaches/admin`, coachForm);
    setCoachForm({ name: "", sport: "badminton" });
    await refreshAll();
  }

  async function toggleCoach(id) {
    await axios.patch(`${API_BASE}/api/coaches/admin/${id}/toggle`);
    await refreshAll();
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
      <p className="text-sm text-slate-600">
        Configure courts, coaches, and dynamic pricing rules for the facility.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Add Court</h2>
          <form onSubmit={handleCourtSubmit} className="space-y-3">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Court name"
              value={courtForm.name}
              onChange={(e) => setCourtForm({ ...courtForm, name: e.target.value })}
            />
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={courtForm.type}
              onChange={(e) => setCourtForm({ ...courtForm, type: e.target.value })}
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
            <input
              type="number"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Base price"
              value={courtForm.basePrice}
              onChange={(e) => setCourtForm({ ...courtForm, basePrice: Number(e.target.value) })}
            />
            <button className="rounded-xl bg-indigo-600 text-white text-sm font-semibold px-3 py-2">
              Save Court
            </button>
          </form>

          <ul className="mt-3 space-y-1 text-sm">
            {courts.map((c) => (
              <li key={c._id} className="flex justify-between border-b border-slate-100 py-1">
                <span>
                  {c.name} ({c.type})
                </span>
                <span className="text-slate-500">₹{c.basePrice}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Add Pricing Rule</h2>
          <form onSubmit={handleRuleSubmit} className="space-y-3 text-sm">
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Rule name"
              value={ruleForm.name}
              onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
            />
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              value={ruleForm.type}
              onChange={(e) => setRuleForm({ ...ruleForm, type: e.target.value })}
            >
              <option value="weekend">Weekend surcharge</option>
              <option value="peak">Peak hour multiplier</option>
              <option value="courtType">Court type surcharge</option>
              <option value="fixed">Fixed surcharge</option>
            </select>

            {ruleForm.type === "weekend" && (
              <input
                type="number"
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Weekend surcharge"
                value={ruleForm.weekendSurcharge}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, weekendSurcharge: Number(e.target.value) })
                }
              />
            )}

            {ruleForm.type === "peak" && (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  placeholder="Start hour"
                  value={ruleForm.startHour}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, startHour: Number(e.target.value) })
                  }
                />
                <input
                  type="number"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  placeholder="End hour"
                  value={ruleForm.endHour}
                  onChange={(e) => setRuleForm({ ...ruleForm, endHour: Number(e.target.value) })}
                />
                <input
                  type="number"
                  step="0.1"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  placeholder="Multiplier"
                  value={ruleForm.multiplier}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, multiplier: Number(e.target.value) })
                  }
                />
              </div>
            )}

            {ruleForm.type === "courtType" && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  value={ruleForm.courtType}
                  onChange={(e) => setRuleForm({ ...ruleForm, courtType: e.target.value })}
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
                <input
                  type="number"
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  placeholder="Surcharge"
                  value={ruleForm.courtTypeSurcharge}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, courtTypeSurcharge: Number(e.target.value) })
                  }
                />
              </div>
            )}

            {ruleForm.type === "fixed" && (
              <input
                type="number"
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Fixed surcharge"
                value={ruleForm.fixedSurcharge}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, fixedSurcharge: Number(e.target.value) })
                }
              />
            )}

            <button className="rounded-xl bg-indigo-600 text-white text-sm font-semibold px-3 py-2">
              Save Rule
            </button>
          </form>

          <ul className="mt-3 space-y-1 text-xs">
            {rules.map((r) => (
              <li key={r._id} className="flex justify-between border-b border-slate-100 py-1">
                <span>{r.name}</span>
                <span className="text-slate-500">{r.type}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Manage Coaches</h2>
        <form onSubmit={handleCoachSubmit} className="flex flex-wrap gap-2 text-sm">
          <input
            className="flex-1 min-w-[140px] rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Coach name"
            value={coachForm.name}
            onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
          />
          <input
            className="flex-1 min-w-[140px] rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Sport"
            value={coachForm.sport}
            onChange={(e) => setCoachForm({ ...coachForm, sport: e.target.value })}
          />
          <button className="rounded-xl bg-indigo-600 text-white text-sm font-semibold px-3 py-2">
            Add Coach
          </button>
        </form>

        <ul className="mt-3 space-y-1 text-sm">
          {coaches.map((c) => (
            <li
              key={c._id}
              className="flex items-center justify-between border-b border-slate-100 py-1"
            >
              <span>
                {c.name} – {c.sport}
              </span>
              <button
                onClick={() => toggleCoach(c._id)}
                className={`text-xs px-2 py-1 rounded-full border ${
                  c.isAvailable
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {c.isAvailable ? "Available" : "Unavailable"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
