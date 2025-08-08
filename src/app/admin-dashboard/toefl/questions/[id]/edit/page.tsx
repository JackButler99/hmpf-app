'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Section = 'reading' | 'listening' | 'grammar';

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [section, setSection] = useState<Section>('grammar');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [promptId, setPromptId] = useState('');
  const [prompts, setPrompts] = useState<{ _id: string; title?: string; passage?: string; audioUrl?: string }[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/toefl/questions/${id}`)
      .then(res => res.json())
      .then(data => {
        const q = data.question;
        setSection(q.section);
        setQuestionText(q.questionText);
        setOptions(q.options);
        setCorrectAnswer(q.correctAnswer);
        setPromptId(q.promptId || '');
      });
  }, [id]);

  useEffect(() => {
    if (section === 'reading' || section === 'listening') {
      fetch(`/api/admin/prompts?section=${section}`)
        .then(res => res.json())
        .then(data => setPrompts(data.prompts));
    } else {
      setPrompts([]);
      setPromptId('');
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/toefl/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section,
        promptId: promptId || null,
        questionText,
        options,
        correctAnswer,
      }),
    });

    if (res.ok) {
      alert('Soal berhasil diperbarui!');
      router.push('/admin-dashboard/toefl/questions');
    } else {
      alert('Gagal mengubah soal');
    }
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Soal</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">

        {/* Section */}
        <div>
          <label className="font-medium block mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as Section)}
            className="w-full border px-3 py-2 rounded"
            disabled
          >
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
            <option value="grammar">Grammar</option>
          </select>
        </div>

        {/* Prompt */}
        {(section === 'reading' || section === 'listening') && (
          <div>
            <label className="font-medium block mb-1">Prompt</label>
            <select
              value={promptId}
              onChange={(e) => setPromptId(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Pilih --</option>
              {prompts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title || p.passage?.slice(0, 50) || p.audioUrl}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Soal */}
        <div>
          <label className="font-medium block mb-1">Teks Soal</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>

        {/* Opsi */}
        {options.map((opt, idx) => (
          <div key={idx}>
            <label className="font-medium block mb-1">Pilihan {String.fromCharCode(65 + idx)}</label>
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[idx] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        {/* Jawaban Benar */}
        <div>
          <label className="font-medium block mb-1">Jawaban Benar</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Pilih Jawaban --</option>
            {options.map((opt, idx) => (
              <option key={idx} value={String.fromCharCode(65 + idx)}>
                {String.fromCharCode(65 + idx)} — {opt || '(kosong)'}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Simpan Perubahan
        </button>
      </form>
    </main>
  );
}
