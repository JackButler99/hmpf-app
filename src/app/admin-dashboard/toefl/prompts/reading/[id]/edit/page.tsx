'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ReadingPromptForm from '@/app/admin-dashboard/toefl/prompts/reading/components/Form';

export default function EditReadingPromptPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<{
    title?: string;
    passage?: string;
    passageNumber?: number;
  }>({});

  useEffect(() => {
    if (!id) return;

    fetch(`/api/toefl/prompts/reading/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const prompt = data.prompt;

        setInitialData({
          title: prompt.title || '',
          passage: prompt.passage || '',
          passageNumber: prompt.passageNumber ?? 1,
        });

        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (data: { 
    title: string; 
    passage: string; 
    passageNumber: number; 
  }) => {

    const res = await fetch(`/api/toefl/prompts/reading/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'reading',
        title: data.title,
        passage: data.passage,
        passageNumber: data.passageNumber,
      }),
    });

    if (res.ok) {
      alert('Prompt updated successfully!');
      router.push('/admin-dashboard/toefl/prompts/reading');
    } else {
      alert('Failed to update prompt.');
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Edit Reading Prompt
      </h1>

      <ReadingPromptForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isEdit
      />
    </main>
  );
}
