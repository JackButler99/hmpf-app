'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditReadingPromptPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState('');
  const [passage, setPassage] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`/api/toefl/prompts/reading/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.prompt.title || '');
        setPassage(data.prompt.passage || '');
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/toefl/prompts/reading/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'reading', title, passage }),
    });

    if (res.ok) {
      alert('Prompt updated successfully!');
      router.push('/admin-dashboard/toefl/prompts/reading');
    } else {
      alert('Failed to update prompt.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Reading Prompt</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="font-medium block mb-1">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Title"
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
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Update Prompt
        </button>
      </form>
    </main>
  );
}
