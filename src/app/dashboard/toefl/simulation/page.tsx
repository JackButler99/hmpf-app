"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type RawQ = {
  _id: string;
  section: string;
  promptId: string | null;
  question_number: number | null;
};

type ListeningPackage = {
  promptId: string;
  title: string;
  questionCount: number;
};

type ReadingPackage = {
  promptId: string;
  title: string;
  questionCount: number;
};

export default function SimulationIntroPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "full";

  const [listeningPkgs, setListeningPkgs] = useState<ListeningPackage[]>([]);
  const [readingPkgs, setReadingPkgs] = useState<ReadingPackage[]>([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);

  /* -------------------------------------------------------
   * FETCH LISTENING / READING PACKAGES
   * ----------------------------------------------------- */
  useEffect(() => {
    if (mode !== "listening" && mode !== "reading") return;

    async function loadPackages() {
      try {
        const res = await fetch("/api/toefl/questions?mode=admin");
        const data = await res.json();
        const all: RawQ[] = data.questions;

        /* --------------------------
           LISTENING
        --------------------------- */
        if (mode === "listening") {
          const listeningQs = all.filter((q) => q.section === "listening");

          const map = new Map<string, RawQ[]>();
          for (const q of listeningQs) {
            if (!q.promptId) continue;
            if (!map.has(q.promptId)) map.set(q.promptId, []);
            map.get(q.promptId)!.push(q);
          }

          setListeningPkgs(
            Array.from(map.entries()).map(([pid, list], i) => ({
              promptId: pid,
              title: `Listening Package ${i + 1}`,
              questionCount: list.length,
            }))
          );
        }

        /* --------------------------
           READING  (NEW)
        --------------------------- */
        if (mode === "reading") {
          const readingQs = all.filter((q) => q.section === "reading");

          const map = new Map<string, RawQ[]>();
          for (const q of readingQs) {
            if (!q.promptId) continue;
            if (!map.has(q.promptId)) map.set(q.promptId, []);
            map.get(q.promptId)!.push(q);
          }

          setReadingPkgs(
            Array.from(map.entries()).map(([pid, list], i) => ({
              promptId: pid,
              title: `Reading Passage ${i + 1}`,
              questionCount: list.length,
            }))
          );
        }

        setLoadingPkgs(false);
      } catch (err) {
        console.error(err);
        setLoadingPkgs(false);
      }
    }

    loadPackages();
  }, [mode]);

  /* -------------------------------------------------------
   * INSTRUCTIONS
   * ----------------------------------------------------- */
  const instructions: Record<string, JSX.Element> = {
    full: (
      <>
        <p>
          Kamu akan mengerjakan <b>Full TOEFL Simulation</b>.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Listening</li>
          <li>Structure</li>
          <li>Reading</li>
        </ul>
      </>
    ),

    listening: (
      <>
        <p>
          Kamu akan mengerjakan <b>Listening Simulation</b>.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Dengar audio hanya sekali</li>
          <li>Jawab pertanyaan setelah audio diputar</li>
          <li>Pilih paket listening terlebih dahulu</li>
        </ul>
      </>
    ),

    reading: (
      <>
        <p>
          Kamu akan mengerjakan <b>Reading Simulation</b>.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Pilih salah satu passage</li>
          <li>Baca teks dengan teliti lalu jawab pertanyaan</li>
        </ul>
      </>
    ),

    structure: (
      <>
        <p><b>Structure & Written Expression</b></p>
        <ul className="list-disc ml-6 mt-2">
          <li>Perhatikan grammar</li>
        </ul>
      </>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl shadow p-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          TOEFL Simulation Instructions
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          Mode: <span className="font-semibold">{mode.toUpperCase()}</span>
        </p>

        {/* Instructions */}
        <div className="prose prose-sm text-gray-800">
          {instructions[mode]}
        </div>

        {/* -----------------------------
             LISTENING PACKAGE PICKER
        ------------------------------ */}
        {mode === "listening" && (
          <div className="mt-6">
            <h2 className="font-semibold mb-3 text-lg text-purple-700">
              Pilih Paket Listening:
            </h2>

            {loadingPkgs ? (
              <p className="text-gray-500">Loading packages...</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {listeningPkgs.map((pkg) => (
                  <Link
                    key={pkg.promptId}
                    href={`/dashboard/toefl/simulation/listening?packageId=${pkg.promptId}`}
                  >
                    <div className="p-4 border rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition shadow-sm">
                      <h3 className="font-medium text-purple-900">{pkg.title}</h3>
                      <p className="text-sm text-gray-600">{pkg.questionCount} questions</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -----------------------------
             READING PACKAGE PICKER (NEW)
        ------------------------------ */}
        {mode === "reading" && (
          <div className="mt-6">
            <h2 className="font-semibold mb-3 text-lg text-red-700">
              Pilih Reading Passage:
            </h2>

            {loadingPkgs ? (
              <p className="text-gray-500">Loading passages...</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {readingPkgs.map((pkg) => (
                  <Link
                    key={pkg.promptId}
                    href={`/dashboard/toefl/simulation/reading?packageId=${pkg.promptId}`}
                  >
                    <div className="p-4 border rounded-lg cursor-pointer bg-red-50 hover:bg-red-100 transition shadow-sm">
                      <h3 className="font-medium text-red-900">{pkg.title}</h3>
                      <p className="text-sm text-gray-600">{pkg.questionCount} questions</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Start Button → NOT FOR LISTEN/READING */}
        {mode !== "listening" && mode !== "reading" && (
          <div className="mt-6 flex justify-end">
            <Link
              href={`/dashboard/toefl/simulation/${mode}`}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Simulation →
            </Link>
          </div>
        )}

        {/* Back */}
        <div className="mt-4">
          <Link href="/dashboard/toefl" className="text-blue-600 underline text-sm">
            ← Back to Menu
          </Link>
        </div>

      </div>
    </div>
  );
}
