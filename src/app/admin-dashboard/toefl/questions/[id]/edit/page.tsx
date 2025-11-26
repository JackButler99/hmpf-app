'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QuestionForm, { QuestionFormData } from '@/app/admin-dashboard/toefl/questions/components/QuestionForm';

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [initialData, setInitialData] = useState<QuestionFormData | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/toefl/questions/${id}`)
      .then((res) => res.json())
      .then((data) => setInitialData(data.question));
  }, [id]);

  const handleSubmit = async (data: QuestionFormData) => {
    const res = await fetch(`/api/toefl/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('Question updated successfully!');
      router.push('/admin-dashboard/toefl/questions');
    } else {
      alert('Failed to update question');
    }
  };

  if (!initialData) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Question</h1>
      <QuestionForm initialData={initialData} onSubmit={handleSubmit} isEdit />
    </main>
  );
}
