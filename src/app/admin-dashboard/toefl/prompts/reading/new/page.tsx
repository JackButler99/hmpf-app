'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddReadingPromptPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [passage, setPassage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/toefl/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'reading',
        title,
        passage
      }),
    });

    if (res.ok) {
      alert('Prompt created successfully!');
      router.push('/admin-dashboard/toefl/prompts/reading');
    } else {
      alert('Failed to create prompt.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add New Reading Prompt</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="font-medium block mb-1">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. The History of Volcanoes"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Passage</label>
          <textarea
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            rows={10}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Paste or write the full passage here..."
          />
        </div>

        <button type="submit" className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Prompt
        </button>
      </form>
    </main>
  );
}
