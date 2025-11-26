"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HistoryItem = {
  _id: string;
  userId: string;
  mode: string;
  score: {
    listening: number;
    structure: number;
    reading: number;
    total: number;
  };
  createdAt: string;
};

const MODE_COLOR: Record<string, string> = {
  listening: "bg-purple-100 text-purple-700 border-purple-300",
  structure: "bg-green-100 text-green-700 border-green-300",
  reading: "bg-red-100 text-red-700 border-red-300",
  full: "bg-blue-100 text-blue-700 border-blue-300",
};

/* ------------------------------------------
   TOEFL ITP SCALING FUNCTIONS
------------------------------------------- */
function scaleListening(raw: number) {
  const scaled = (raw / 50) * (68 - 31) + 31;
  return Math.round(scaled);
}

function scaleStructure(raw: number) {
  const scaled = (raw / 40) * (68 - 31) + 31;
  return Math.round(scaled);
}

function scaleReading(raw: number) {
  const scaled = (raw / 50) * (67 - 31) + 31;
  return Math.round(scaled);
}

export default function SimulationHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const boot = async () => {
      const res = await fetch(`/api/toefl/simulation/history`);
      const json = await res.json();
      setHistory(json.histories || []);
      setLoading(false);
    };

    boot();
  }, []);

  if (loading)
    return (
      <div className="p-6 min-h-screen bg-gray-100 animate-pulse text-gray-600">
        Loading history...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back */}
        <Link
          href="/dashboard/toefl"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to TOEFL Dashboard
        </Link>

        {/* Title */}
        <div className="bg-white border rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800">Simulation History</h1>
          <p className="text-gray-600 text-sm mt-1">
            Semua hasil TOEFL simulation yang pernah kamu kerjakan.
          </p>
        </div>

        {/* If empty */}
        {history.length === 0 && (
          <div className="bg-white border rounded-xl shadow p-10 text-center">
            <p className="text-gray-500 mb-2">Belum ada riwayat tes.</p>
            <Link
              href="/dashboard/toefl"
              className="text-blue-600 underline"
            >
              Mulai simulasi pertama →
            </Link>
          </div>
        )}

        {/* LIST */}
        <div className="grid gap-4">
          {history.map((h) => {
            const L_scaled = scaleListening(h.score.listening);
            const S_scaled = scaleStructure(h.score.structure);
            const R_scaled = scaleReading(h.score.reading);
            const TOTAL_ITP = L_scaled + S_scaled + R_scaled;

            return (
              <div
                key={h._id}
                className="bg-white p-5 border rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  {/* LEFT */}
                  <div>
                    <div
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${MODE_COLOR[h.mode]}`}
                    >
                      {h.mode.toUpperCase()}
                    </div>

                    <p className="mt-2 text-gray-700">
                      <span className="font-semibold">Raw Score Total:</span>{" "}
                      {h.score.total}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(h.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* MID → Scaled Scores */}
                  <div className="text-sm text-gray-700 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-semibold">Listening</p>
                      <p className="text-lg">{L_scaled}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Structure</p>
                      <p className="text-lg">{S_scaled}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Reading</p>
                      <p className="text-lg">{R_scaled}</p>
                    </div>
                  </div>

                  {/* RIGHT → TOTAL ITP */}
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500">TOEFL ITP Score</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {TOTAL_ITP}
                    </p>

                    <Link
                      href={`/dashboard/toefl/simulation/review/${h._id}`}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      View Review →
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
