'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';

// React Icons
import { 
  FiBookOpen, 
  FiFileText, 
  FiBook, 
  FiHeadphones,
  FiArrowLeft     // <-- NEW BACK ICON
} from "react-icons/fi";

// Import classy loader
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ToeflAdminClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    listening_questions: 0,
    reading_questions: 0,
    grammar_questions: 0,
    reading_prompts: 0,
    listening_prompts: 0
  });

  useEffect(() => {
    fetch('/api/toefl/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* BACK BUTTON — at the top */}
        <div className="w-full flex mb-2">
          <BackButton />
        </div>

        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200 p-8">
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TOEFL Admin Dashboard
            </span>
          </h1>

          <p className="mt-2 text-slate-600 text-lg">
            Manage all TOEFL materials, questions, and prompts.
          </p>
        </div>

        {/* STAT CARDS */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Statistics Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <GlassStat label="Reading Questions" value={stats.reading_questions} />
            <GlassStat label="Listening Questions" value={stats.listening_questions} />
            <GlassStat label="Grammar Questions" value={stats.grammar_questions} />
            <GlassStat label="Reading Prompts" value={stats.reading_prompts} />
            <GlassStat label="Listening Prompts" value={stats.listening_prompts} />
          </div>
        </section>

        {/* MANAGEMENT BUTTONS */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Management Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RippleButton
              href="/admin-dashboard/toefl/questions"
              color="from-blue-600 to-blue-700"
              icon={<FiBookOpen className="w-7 h-7" />}
              label="Manage Questions"
            />

            <RippleButton
              href="/admin-dashboard/toefl/materials"
              color="from-green-600 to-green-700"
              icon={<FiFileText className="w-7 h-7" />}
              label="Manage Lesson Materials"
            />

            <RippleButton
              href="/admin-dashboard/toefl/prompts/reading"
              color="from-yellow-600 to-yellow-700"
              icon={<FiBook className="w-7 h-7" />}
              label="Manage Reading Prompts"
            />

            <RippleButton
              href="/admin-dashboard/toefl/prompts/listening"
              color="from-purple-600 to-purple-700"
              icon={<FiHeadphones className="w-7 h-7" />}
              label="Manage Listening Prompts"
            />
          </div>
        </section>

      </div>
    </main>
  );
}

/* ======================== */
/*      GLASS STAT CARD     */
/* ======================== */
function GlassStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="
      bg-white/40 backdrop-blur-xl 
      border border-white/50 
      shadow-lg rounded-xl p-6 text-center
    ">
      <div className="text-sm text-slate-600 mb-1 font-medium">
        {label}
      </div>
      <div className="text-3xl font-extrabold text-slate-900">
        {value}
      </div>
    </div>
  );
}

/* ======================== */
/*     BACK BUTTON UI       */
/* ======================== */
function BackButton() {
  return (
    <Link href="/admin-dashboard" className="w-full md:w-auto">
      <div
        className="
          group relative overflow-hidden
          inline-flex items-center gap-3
          rounded-xl px-6 py-3
          shadow-md border border-slate-300
          bg-white/80 backdrop-blur-md
          text-slate-700 font-semibold text-lg
          transition hover:shadow-lg hover:-translate-y-1 cursor-pointer
        "
      >
        {/* Ripple */}
        <span className="
          absolute inset-0 
          bg-slate-200/40 opacity-0 
          group-hover:opacity-100 
          transition-opacity duration-300
        "></span>

        {/* Icon */}
        <div className="p-2 bg-slate-100/60 rounded-lg backdrop-blur-sm">
          <FiArrowLeft className="w-6 h-6 text-slate-700" /> {/* <-- USE BACK ICON */}
        </div>

        {/* Label */}
        <span className="relative z-10">
          Back to Admin Dashboard
        </span>
      </div>
    </Link>
  );
}

/* ======================== */
/*  RIPPLE BUTTON COMPONENT */
/* ======================== */
function RippleButton({
  href,
  label,
  icon,
  color
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Link href={href} className="block">
      <div
        className={`
          group relative overflow-hidden
          w-full flex items-center gap-4
          rounded-xl p-5 shadow-md border border-slate-200
          bg-gradient-to-br ${color}
          text-white font-semibold text-lg
          transition hover:shadow-xl hover:-translate-y-1 cursor-pointer
        `}
      >
        {/* Ripple */}
        <span className="
          absolute inset-0 
          bg-white/20 opacity-0 
          group-hover:opacity-100 
          transition-opacity duration-300
        "></span>

        {/* Icon Container */}
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          {icon}
        </div>

        {/* Label */}
        <div className="relative z-10">
          {label}
        </div>
      </div>
    </Link>
  );
}
