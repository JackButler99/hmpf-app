'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import '@/app/styles/quill-custom.css'

// Dynamically import to prevent SSR errors in Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type Section = 'reading' | 'listening' | 'grammar';

export type QuestionFormData = {
  section: Section;
  questionText: string;
  options: string[];
  correctAnswer: string;
  promptId?: string | null;
  question_number?: number | '';
  explanation?: string;
};

interface Prompt {
  _id: string;
  title?: string;
  passage?: string;
  passageNumber?:number;
  audioUrl?: string;
}

interface QuestionFormProps {
  initialData?: QuestionFormData;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  isEdit?: boolean;
}

export default function QuestionForm({ initialData, onSubmit, isEdit }: QuestionFormProps) {
  const router = useRouter();
  const [section, setSection] = useState<Section>(initialData?.section || 'grammar');
  const [questionText, setQuestionText] = useState(initialData?.questionText || '');
  const [options, setOptions] = useState<string[]>(initialData?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer || '');
  const [promptId, setPromptId] = useState(initialData?.promptId || '');
  const [question_number, setQuestionNumber] = useState<number | ''>(initialData?.question_number || '');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [explanation, setExplanation] = useState(initialData?.explanation || '');

  useEffect(() => {
    if (section === 'reading' || section === 'listening') {
      fetch(`/api/toefl/prompts?section=${section}`)
        .then(res => res.json())
        .then(data => setPrompts(data.prompts));
    } else {
      setPrompts([]);
      setPromptId('');
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: QuestionFormData = {
      section,
      promptId: promptId || null,
      questionText,
      options,
      correctAnswer,
      explanation,
      question_number: section === 'listening' ? question_number : undefined,
    };
    await onSubmit(payload);
  };

  const handleCancel = () => {
    if (confirm('Cancel changes and go back to questions page?')) {
      router.push('/admin-dashboard/toefl/questions');
    }
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  return (
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

      {/* Question Number (listening only) */}
      {section === 'listening' && (
        <div>
          <label className="font-medium block mb-1">Question Number</label>
          <input
            type="number"
            min={1}
            value={question_number}
            onChange={(e) => setQuestionNumber(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      )}

      {/* Question Text */}
      <div className="space-y-2 mb-20">
        <label className="font-medium block">Question Text</label>
        <ReactQuill
          theme="snow"
          value={questionText}
          onChange={setQuestionText}
          modules={quillModules}
          className="bg-white h-[300px]"
        />
        
      </div>

      <div className="mt-2 space-y-3">
        {options.map((opt, idx) => (
          <div key={idx}>
            <label className="font-medium block mb-1">
              Option {String.fromCharCode(65 + idx)}
            </label>
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
      </div>

      

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

      {/* Explanation */}
      <div className="space-y-2 mb-20">
        <label className="font-medium block">Answer Explanation</label>
        <ReactQuill
          theme="snow"
          value={explanation}
          onChange={setExplanation}
          modules={quillModules}
          className="bg-white h-[270px]"
        />
        
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isEdit ? 'Save Changes' : 'Save Question'}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
