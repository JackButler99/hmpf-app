"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Question = {
  _id: string;
  promptId: string | null;
  section: "listening" | "structure" | "reading";
  questionText: string;
  options: string[];
  question_number?: number;
};

type AnswerMap = {
  [index: number]: { selected: string | null; section: Question["section"] };
};

const TEST_MINUTES = 30;
const STORAGE_KEY = "toefl_structure_sim_answers";

export default function StructureSimulationPage() {
  const { data: session } = useSession();
  const userId = session?.user?.email ?? "guest";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState(TEST_MINUTES * 60);

  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const q = questions[current];

  /* --------------------------------------------------
     PROGRESS
  --------------------------------------------------- */
  const progress = useMemo(() => {
    const answered = Object.keys(answers).length;
    return questions.length
      ? Math.round((answered / questions.length) * 100)
      : 0;
  }, [answers, questions.length]);

  /* --------------------------------------------------
     LOAD QUESTIONS
  --------------------------------------------------- */
  useEffect(() => {
    const boot = async () => {
      try {
        localStorage.removeItem(STORAGE_KEY);

        // kill previous backend session
        await fetch("/api/toefl/simulation/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, mode: "structure" }),
        });

        setAnswers({});
        setCurrent(0);
        setTimeLeft(TEST_MINUTES * 60);

        const qs: Question[] = await fetch(
          `/api/toefl/questions?mode=structure`
        )
          .then((r) => r.json())
          .then((d) => d.questions);

        setQuestions(qs);

        // backend session start
        await fetch("/api/toefl/simulation/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, mode: "structure" }),
        });
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, [userId]);

  /* --------------------------------------------------
     TIMER
  --------------------------------------------------- */
  useEffect(() => {
  if (loading) return;

  if (tickRef.current) {
    clearInterval(tickRef.current);
  }

  tickRef.current = setInterval(() => {
    setTimeLeft((t) => t - 1);
  }, 1000);

  return () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
    }
  };
}, [loading]);


  /* --------------------------------------------------
     SAVE PROGRESS
  --------------------------------------------------- */
  useEffect(() => {
    if (!loading)
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, current, timeLeft })
      );
  }, [answers, current, timeLeft, loading]);

  /* --------------------------------------------------
     AUTO SUBMIT ON TIMEOUT
  --------------------------------------------------- */
  useEffect(() => {
    if (timeLeft <= 0 && !submitting) handleSubmit(true);
  }, [timeLeft, submitting]);

  /* --------------------------------------------------
     SELECT ANSWER
  --------------------------------------------------- */
  function handleSelect(optionIndex: number) {
    const label = String.fromCharCode(65 + optionIndex);
    setAnswers((prev) => ({
      ...prev,
      [current]: {
        selected: label,
        section: "structure",
      },
    }));
  }

  /* --------------------------------------------------
     NAVIGATION
  --------------------------------------------------- */
  function next() {
    setCurrent((c) => Math.min(c + 1, questions.length - 1));
  }

  function prev() {
    setCurrent((c) => Math.max(c - 1, 0));
  }

  /* --------------------------------------------------
     SUBMIT TEST
  --------------------------------------------------- */
  async function handleSubmit(auto: boolean) {
    setSubmitting(true);

    const formattedAnswers = questions.map((question, index) => ({
      questionId: question._id,
      userAnswer: answers[index]?.selected ?? null,
      section: "structure",
      promptId: question.promptId,
    }));

    const res = await fetch(`/api/toefl/simulation/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        mode: "structure",
        answers: formattedAnswers,
      }),
    }).then((r) => r.json());

    localStorage.removeItem(STORAGE_KEY);

    window.location.href = `/dashboard/toefl/simulation/review/${res.historyId}`;
  }

  /* --------------------------------------------------
     UI RENDER
  --------------------------------------------------- */
  if (loading)
    return (
      <div className="p-6 bg-gray-100 min-h-screen animate-pulse text-gray-600">
        Loading questions...
      </div>
    );

  if (!questions.length)
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-xl border shadow-sm max-w-xl">
          No structure questions found.
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Back */}
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          href="/dashboard/toefl"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to TOEFL Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Structure & Written Expression
        </h1>
        <div className="text-sm text-gray-700">
          Time Left:{" "}
          <span className="font-semibold">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto mb-3">
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="h-2 bg-blue-600 rounded transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-5xl mx-auto bg-white p-5 md:p-6 rounded-xl border shadow">
        <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
          <span>
            Section: <span className="font-medium">structure</span>
          </span>

          <span>
            Question {current + 1} / {questions.length}
          </span>
        </div>

        {/* Question */}
        <div
          className="prose prose-sm mb-4 max-w-none text-gray-900"
          dangerouslySetInnerHTML={{
            __html: q.questionText,
          }}
        />

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            const label = String.fromCharCode(65 + oi);
            const selected = answers[current]?.selected === label;

            return (
              <button
                key={oi}
                onClick={() => handleSelect(oi)}
                className={`w-full text-left border rounded p-3 transition ${
                  selected
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <span className="font-semibold mr-2">{label}.</span>
                <span dangerouslySetInnerHTML={{ __html: opt }} />
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-4 py-2 rounded border bg-white disabled:opacity-50"
          >
            Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={next}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          )}

          <Link
            href="/dashboard/toefl/simulation"
            className="ml-auto text-blue-600 underline"
          >
            Exit
          </Link>
        </div>
      </div>

      {/* Quick Navigator */}
      <div className="max-w-5xl mx-auto bg-white p-4 rounded-xl border shadow mt-6">
        <p className="font-semibold mb-3">Quick Navigator</p>

        <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-2">
          {questions.map((_, i) => {
            const answered = !!answers[i];
            const active = current === i;

            return (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-9 rounded border text-sm ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : answered
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
