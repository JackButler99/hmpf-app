'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ListeningPrompt = {
  _id: string;
  title?: string;
  audioUrl: string;
  instruction?: string;
  transcript?: string;
  createdAt?: string;
};

export default function ListeningPromptsDashboard() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<ListeningPrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/toefl/prompts?section=listening')
      .then((res) => res.json())
      .then((data) => {
        setPrompts(data.prompts);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this prompt?');
    if (!confirm) return;

    const res = await fetch(`/api/toefl/prompts/listening/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setPrompts((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert('Failed to delete prompt');
    }
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listening Prompts</h1>
        <Link href="/admin-dashboard/toefl/prompts/listening/new">
          <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add New
          </button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : prompts.length === 0 ? (
        <p>No prompts found.</p>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <h2 className="font-semibold text-lg mb-1">
                    {prompt.title || '(No Title)'}
                  </h2>

                  {/* 🎧 Audio player */}
                  <audio controls className="w-full mb-2">
                    <source src={prompt.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>

                  {prompt.instruction && (
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Instruction:</span> {prompt.instruction}
                    </p>
                  )}

                  {prompt.transcript && (
                    <details>
                      <summary className="cursor-pointer text-blue-600">Transcript</summary>
                      <pre className="text-sm mt-1 whitespace-pre-wrap">{prompt.transcript}</pre>
                    </details>
                  )}
                </div>

                <div className="space-x-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin-dashboard/toefl/prompts/listening/${prompt._id}/edit`)}
                    className="cursor-pointer bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prompt._id)}
                    className="cursor-pointer bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
