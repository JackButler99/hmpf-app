'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditListeningPromptPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [audioUrl, setAudioUrl] = useState('');
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/toefl/prompts/listening/${id}`)
      .then(res => res.json())
      .then(data => {
        setAudioUrl(data.prompt.audioUrl);
        setTitle(data.prompt.title || '');
        setInstruction(data.prompt.instruction || '');
        setTranscript(data.prompt.transcript || '');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/toefl/prompts/listening/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioUrl, title, instruction, transcript }),
    });

    if (res.ok) {
      alert('Prompt updated successfully!');
      router.push('/admin-dashboard/toefl/prompts/listening');
    } else {
      alert('Failed to update prompt.');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Listening Prompt</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Title (optional)" />
        <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} required className="w-full border px-3 py-2 rounded" placeholder="Audio URL" />
        <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Instruction (optional)" />
        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Transcript (optional)" />
        <button type="submit" className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Changes</button>
      </form>
    </main>
  );
}
