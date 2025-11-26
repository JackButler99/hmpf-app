'use client';

import { useRouter } from 'next/navigation';
import QuestionForm, { QuestionFormData } from '@/app/admin-dashboard/toefl/questions/components/QuestionForm';

export default function AddQuestionPage() {
  const router = useRouter();

  const handleSubmit = async (data: QuestionFormData) => {
    const res = await fetch('/api/toefl/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('The question has been successfully added!');
      router.push('/admin-dashboard/toefl/questions');
    } else {
      alert('Failed to add question');
    }
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Add a New Question</h1>
      <QuestionForm onSubmit={handleSubmit} />
    </main>
  );
}
