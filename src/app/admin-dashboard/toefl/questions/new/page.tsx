'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Section = 'reading' | 'listening' | 'grammar';

export default function AddQuestionPage() {
  const router = useRouter();

  const [section, setSection] = useState<Section>('grammar');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [promptId, setPromptId] = useState('');
  const [questionNumber, setQuestionNumber] = useState<number | ''>('');
  const [prompts, setPrompts] = useState<{ _id: string; title?: string; passage?: string; audioUrl?: string }[]>([]);
  const [explanation, setExplanation] = useState('');


  useEffect(() => {
    if (section === 'reading' || section === 'listening') {
      fetch(`/api/toefl/prompts?section=${section}`)
        .then((res) => res.json())
        .then((data) => setPrompts(data.prompts));
    } else {
      setPrompts([]);
      setPromptId('');
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      section,
      promptId: promptId || null,
      questionText,
      options,
      correctAnswer,
      explanation
    };

    if (section === 'listening') {
      payload.question_number = questionNumber;
    }

    const res = await fetch('/api/toefl/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
      <h1 className="text-2xl font-bold mb-4">Add A New Question</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">

        {/* Section */}
        <div>
          <label className="font-medium block mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => {
              setSection(e.target.value as Section);
              setQuestionNumber('');
            }}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
            <option value="grammar">Grammar</option>
          </select>
        </div>

        {/* Prompt */}
        {(section === 'reading' || section === 'listening') && (
          <div>
            <label className="font-medium block mb-1">Select Prompt</label>
            <select
              value={promptId}
              onChange={(e) => setPromptId(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Choose Prompt --</option>
              {prompts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title || p.passage?.slice(0, 50) || p.audioUrl}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Question Number (only for listening) */}
        {section === 'listening' && (
          <div>
            <label className="font-medium block mb-1">Question Number</label>
            <input
              type="number"
              min={1}
              value={questionNumber}
              onChange={(e) => setQuestionNumber(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        )}

        {/* Question */}
        <div>
          <label className="font-medium block mb-1">Question Text</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>

        {/* Options */}
        {options.map((opt, idx) => (
          <div key={idx}>
            <label className="font-medium block mb-1">Option {String.fromCharCode(65 + idx)}</label>
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

        {/* Correct Answer */}
        <div>
          <label className="font-medium block mb-1">Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Answer --</option>
            {options.map((opt, idx) => (
              <option key={idx} value={String.fromCharCode(65 + idx)}>
                {String.fromCharCode(65 + idx)} — {opt || '(empty)'}
              </option>
            ))}
          </select>
        </div>

        {/* Answer Explanation */}
        <div>
          <label className="font-medium block mb-1">Answer Explanation (optional)</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={3}
            placeholder="Explain why the answer is correct (optional)"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Question
        </button>
      </form>
    </main>
  );
}
