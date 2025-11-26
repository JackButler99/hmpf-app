'use client';

import { useRouter } from 'next/navigation';
import ReadingPromptForm from '@/app/admin-dashboard/toefl/prompts/reading/components/Form';

export default function AddReadingPromptPage() {
  const router = useRouter();

  const handleSubmit = async (data: { title: string; passage: string, passageNumber: number}) => {
    const res = await fetch('/api/toefl/prompts?section=reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'reading',
        title: data.title,
        passage: data.passage,
        passageNumber: data.passageNumber,
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
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Add New Reading Prompt
      </h1>
      <ReadingPromptForm onSubmit={handleSubmit} />
    </main>
  );
}
