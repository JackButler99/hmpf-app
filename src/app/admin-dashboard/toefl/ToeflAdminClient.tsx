'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';

export default function ToeflAdminClient() {
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
      .then((data) => setStats(data));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl text-gray-900 font-bold mb-6">TOEFL Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card label="Reading Questions" value={stats.reading_questions} />
        <Card label="Listening Questions" value={stats.listening_questions} />
        <Card label="Grammar Questions" value={stats.grammar_questions} />
        <Card label="Reading Prompts" value={stats.reading_prompts} />
        <Card label="Listening Prompts" value={stats.listening_prompts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin-dashboard/toefl/questions">
          <button className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            📚 Manage Questions
          </button>
        </Link>
        <Link href="/admin-dashboard/toefl/materials">
          <button className="cursor-pointer w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
            📘 Manage Lesson Materials
          </button>
        </Link>
        <Link href="/admin-dashboard/toefl/prompts/reading">
          <button className="cursor-pointer w-full bg-yellow-600 text-white py-3 rounded hover:bg-yellow-700">
            📘 Manage Reading Prompts
          </button>
        </Link>
        <Link href="/admin-dashboard/toefl/prompts/listening">
          <button className="cursor-pointer w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700">
            🎧 Manage Listening Prompts
          </button>
        </Link>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
