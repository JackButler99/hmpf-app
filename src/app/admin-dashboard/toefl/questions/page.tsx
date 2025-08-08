'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Section = 'reading' | 'listening' | 'grammar';

type Question = {
  _id: string;
  section: Section;
  questionText: string;
};

export default function QuestionListPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState<'all' | Section>('all');

  useEffect(() => {
    fetch('/api/toefl/questions')
      .then(res => res.json())
      .then(data => setQuestions(data.questions));
  }, []);

  const filteredQuestions = filter === 'all'
    ? questions
    : questions.filter(q => q.section === filter);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage TOEFL Questions</h1>
        <Link href="/admin-dashboard/toefl/questions/new">
          <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Questions
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <label className="mr-2 text-sm font-medium">Filter Section:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="reading">Reading</option>
          <option value="listening">Listening</option>
          <option value="grammar">Grammar</option>
        </select>
      </div>

      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">Section</th>
            <th className="p-3">Questions</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q) => (
            <tr key={q._id} className="border-t">
              <td className="p-3 capitalize">{q.section}</td>
              <td className="p-3">{q.questionText.slice(0, 100)}...</td>
              <td className="p-3 space-x-3">
                <Link href={`/admin-dashboard/toefl/questions/${q._id}/edit`}>
                  <button className="cursor-pointer text-blue-600 hover:underline">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="cursor-pointer text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );

  async function handleDelete(id: string) {
    if (!confirm('Are you sure want to delete this question?')) return;
    await fetch(`/api/toefl/questions/${id}`, { method: 'DELETE' });
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  }
}
