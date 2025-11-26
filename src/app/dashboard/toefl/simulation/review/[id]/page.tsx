"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ----------------------------------------------
   TYPES
---------------------------------------------- */
type ReviewItem = {
  questionId: string;
  section: "reading" | "listening" | "grammar" | "structure";
  promptId: string | null;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;

  questionText: string;
  options: string[];
  question_number?: number | null;
};

type PromptInfo = {
  _id: string;
  type: "reading" | "listening";
  passage?: string;
  audioUrl?: string;
};

type HistoryResponse = {
  history: {
    _id: string;
    userId: string;
    mode: "full" | "reading" | "listening" | "structure";
    score: { listening: number; structure: number; reading: number; total: number };
    createdAt: string;
  };
  items: ReviewItem[];
  prompts: Record<string, PromptInfo>;
};

/* ----------------------------------------------
   SCALING
---------------------------------------------- */
function scaleListening(raw: number) {
  return Math.round((raw / 50) * (68 - 31) + 31);
}
function scaleStructure(raw: number) {
  return Math.round((raw / 40) * (68 - 31) + 31);
}
function scaleReading(raw: number) {
  return Math.round((raw / 50) * (67 - 31) + 31);
}

/* ----------------------------------------------
   PAGE
---------------------------------------------- */
export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const historyId = params.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HistoryResponse | null>(null);

  /* ----------------------------------------------
     FETCH HISTORY
  ---------------------------------------------- */
  useEffect(() => {
    const boot = async () => {
      try {
        const res = await fetch(`/api/toefl/simulation/history/${historyId}`);
        const json = await res.json();

        // if API error or nothing returned
        if (!json || json.error) {
          setData(null);
        } else {
          setData(json);
        }
      } finally {
        setLoading(false);
      }
    };
    if (historyId) boot();
  }, [historyId]);

  /* ----------------------------------------------
     GROUP BY SECTION
  ---------------------------------------------- */
  const groupedBySection = useMemo(() => {
    if (!data || !data.items) return { listening: [], structure: [], reading: [] };

    const norm = data.items.map((i) => ({
      ...i,
      section: i.section === "grammar" ? "structure" : i.section,
    }));

    return {
      listening: norm.filter((i) => i.section === "listening"),
      structure: norm.filter((i) => i.section === "structure"),
      reading: norm.filter((i) => i.section === "reading"),
    };
  }, [data]);

  /* ----------------------------------------------
     LOADING
  ---------------------------------------------- */
  if (loading)
    return (
      <div className="p-6 bg-gray-100 min-h-screen animate-pulse text-gray-600">
        Loading review...
      </div>
    );

  if (!data)
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white border rounded-xl shadow p-6">
          <p>Review not found.</p>
          <Link href="/dashboard/toefl" className="text-blue-600 underline">
            Back to Toefl Menu
          </Link>
        </div>
      </div>
    );

  const { history, prompts } = data;
  const mode = history.mode;

  /* ----------------------------------------------
     SCORE
  ---------------------------------------------- */
  const L_raw = history.score.listening;
  const S_raw = history.score.structure;
  const R_raw = history.score.reading;

  const L_scaled = scaleListening(L_raw);
  const S_scaled = scaleStructure(S_raw);
  const R_scaled = scaleReading(R_raw);
  const TOTAL_TOEFL = L_scaled + S_scaled + R_scaled;

  /* ----------------------------------------------
     RENDER
  ---------------------------------------------- */
  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Back */}
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          href="/dashboard/toefl"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to TOEFL Menu
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white border rounded-xl shadow p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Test Review</h1>
            <p className="text-gray-600 text-sm">
              Session: <span className="font-mono">{history._id}</span> •{" "}
              {new Date(history.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Raw Score Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
            {(mode === "full" || mode === "listening") && (
              <ScoreCard label="Listening Raw" value={L_raw} color="blue" />
            )}

            {(mode === "full" || mode === "structure") && (
              <ScoreCard label="Structure Raw" value={S_raw} color="green" />
            )}

            {(mode === "full" || mode === "reading") && (
              <ScoreCard label="Reading Raw" value={R_raw} color="red" />
            )}

            {mode === "full" && (
              <ScoreCard label="Raw Total" value={history.score.total} color="purple" />
            )}
          </div>
        </div>
      </div>

      {/* TOEFL Scaled Score */}
      <div className="max-w-5xl mx-auto bg-white border rounded-xl shadow p-5 mt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Official TOEFL Score</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {(mode === "full" || mode === "listening") && (
            <ScoreCard label="Listening" value={L_scaled} color="blue" />
          )}

          {(mode === "full" || mode === "structure") && (
            <ScoreCard label="Structure" value={S_scaled} color="green" />
          )}

          {(mode === "full" || mode === "reading") && (
            <ScoreCard label="Reading" value={R_scaled} color="red" />
          )}

          {mode === "full" && (
            <ScoreCard label="TOTAL TOEFL" value={TOTAL_TOEFL} color="purple" />
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto space-y-8 mt-6">
        {(mode === "full" || mode === "listening") &&
          groupedBySection.listening.length > 0 && (
            <SectionBlock
              title="Listening Comprehension"
              items={groupedBySection.listening}
              prompts={prompts}
              color="blue"
            />
          )}

        {(mode === "full" || mode === "structure") &&
          groupedBySection.structure.length > 0 && (
            <SectionBlock
              title="Structure & Written Expression"
              items={groupedBySection.structure}
              prompts={prompts}
              color="green"
            />
          )}

        {(mode === "full" || mode === "reading") &&
          groupedBySection.reading.length > 0 && (
            <SectionBlock
              title="Reading Comprehension"
              items={groupedBySection.reading}
              prompts={prompts}
              color="red"
            />
          )}
      </div>
    </div>
  );
}

/* ======================================================
   SMALL COMPONENTS
====================================================== */
function ScoreCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-lg border p-3 bg-${color}-50 border-${color}-200`}>
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className={`text-xl font-bold text-${color}-700`}>{value}</p>
    </div>
  );
}

/* ---------------------------------------------- */
function SectionBlock({
  title,
  items,
  prompts,
  color,
}: {
  title: string;
  items: ReviewItem[];
  prompts: Record<string, PromptInfo>;
  color: "blue" | "green" | "red";
}) {
  const groups = useMemo(() => {
    const map = new Map<string, ReviewItem[]>();

    for (const it of items) {
      const key = it.promptId ?? "null";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }

    for (const [k, arr] of map) {
      map.set(
        k,
        arr.slice().sort((a, b) => (a.question_number ?? 999) - (b.question_number ?? 999))
      );
    }

    return Array.from(map.entries());
  }, [items]);

  const colorBar = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
  }[color];

  const promptTint = {
  blue: "bg-blue-50 border-blue-200",
  green: "bg-green-50 border-green-200",
  red: "bg-cyan-50 border-cyan-200",
}[color];


  return (
    <section className="bg-white border rounded-xl shadow">
      <div className={`h-1.5 ${colorBar} rounded-t-xl`} />

      <div className="p-5 space-y-8">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>

        {groups.map(([pid, arr], idx) => {
          const prompt = pid !== "null" ? prompts[pid] : undefined;

          return (
            <div key={pid + "_" + idx} className="space-y-4">
              {prompt && (
                <div className={`border ${promptTint} rounded-lg p-4`}>
                  {prompt.type === "reading" && prompt.passage && (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: prompt.passage }}
                    />
                  )}

                  {prompt.type === "listening" && (
                    <>
                      {prompt.passage && (
                        <div
                          className="prose prose-sm mb-3"
                          dangerouslySetInnerHTML={{ __html: prompt.passage }}
                        />
                      )}
                      {prompt.audioUrl && (
                        <audio controls className="w-full" preload="metadata">
                          <source src={prompt.audioUrl} />
                        </audio>
                      )}
                    </>
                  )}
                </div>
              )}

              {arr.map((q) => (
                <QuestionBlock q={q} color={color} key={q.questionId} />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------------------- */
function QuestionBlock({
  q,
  color,
}: {
  q: ReviewItem;
  color: "blue" | "green" | "red";
}) {
  const borderSoft = {
    blue: "border-blue-200",
    green: "border-green-200",
    red: "border-cyan-200",
  }[color];

  return (
    <div className={`border ${borderSoft} rounded-lg p-4`}>
      <div
        className="prose prose-sm max-w-none text-gray-900 mb-3"
        dangerouslySetInnerHTML={{ __html: q.questionText }}
      />

      <div className="grid sm:grid-cols-2 gap-2">
        {q.options.map((op, oi) => {
          const label = String.fromCharCode(65 + oi);
          const isUser = q.userAnswer === label;
          const isCorrect = q.correctAnswer === label;

          const base = "w-full text-left border rounded p-3 text-sm";
          const styles = isCorrect
            ? "bg-green-50 border-green-400"
            : isUser
            ? "bg-red-50 border-red-400"
            : "bg-white border-gray-200";

          return (
            <div key={label} className={`${base} ${styles}`}>
              <span className="font-semibold mr-2">{label}.</span>
              <span dangerouslySetInnerHTML={{ __html: op }} />

              {isUser && (
                <span className="ml-2 text-xs text-gray-600">(your choice)</span>
              )}

              {isCorrect && (
                <span className="ml-2 text-xs text-green-700 font-semibold">✓ correct</span>
              )}
            </div>
          );
        })}
      </div>

      {q.explanation && (
        <div className="mt-3 text-sm">
          <p className="font-semibold text-gray-700 mb-1">Explanation</p>
          <div
            className="prose prose-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: q.explanation }}
          />
        </div>
      )}
    </div>
  );
}
