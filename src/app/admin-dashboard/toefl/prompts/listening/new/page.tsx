'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddListeningPromptPage() {
  const router = useRouter();

  const [audioUrl, setAudioUrl] = useState('');
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [transcript, setTranscript] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/toefl/prompts?section=listening', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioUrl,
        title,
        instruction,
        transcript,
      }),
    });

    if (res.ok) {
      alert('Listening prompt created successfully!');
      router.push('/admin-dashboard/toefl/prompts/listening');
    } else {
      alert('Failed to create prompt');
    }
  };
  
  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Add Listening Prompt</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block font-medium mb-1">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Audio URL</label>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Instruction (optional)</label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Transcript (optional)</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={5}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Prompt
        </button>
      </form>
    </main>
  );
}
