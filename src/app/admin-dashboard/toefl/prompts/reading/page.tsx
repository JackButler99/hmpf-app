'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ReadingPrompt = {
  _id: string;
  title?: string;
  passage: string;
};

export default function ReadingPromptManager() {
  const [prompts, setPrompts] = useState<ReadingPrompt[]>([]);

  useEffect(() => {
    fetch('/api/toefl/prompts?section=reading')
      .then((res) => res.json())
      .then((data) => setPrompts(data.prompts));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    await fetch(`/api/toefl/prompts/reading/${id}`, { method: 'DELETE' });
    setPrompts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reading Prompts</h1>
        <Link href="/admin-dashboard/toefl/prompts/reading/new">
          <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add New Prompt
          </button>
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">Title / Excerpt</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-3">{p.title || p.passage.slice(0, 100)}...</td>
              <td className="p-3 space-x-3">
                <Link href={`/admin-dashboard/toefl/prompts/reading/${p._id}/edit`}>
                  <button className="cursor-pointer text-blue-600 hover:underline">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
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
}
