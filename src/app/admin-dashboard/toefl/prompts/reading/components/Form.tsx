'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import '@/app/styles/quill-custom.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ReadingPromptFormProps {
  initialData?: {
    title?: string;
    passage?: string;
    passageNumber?: number;
  };
  onSubmit: (data: { title: string; passage: string; passageNumber: number }) => Promise<void>;
  isEdit?: boolean;
}


export default function ReadingPromptForm({
  initialData,
  onSubmit,
  isEdit = false,
}: ReadingPromptFormProps) {
  const [title, setTitle] = useState('');
  const [passage, setPassage] = useState('');
  const [passageNumber, setPassageNumber] = useState<number>(1);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setPassage(initialData.passage || '');
      setPassageNumber(initialData.passageNumber || 1);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      passage,
      passageNumber,
    });
  };
  
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
      
      {/* Passage Number */}
      <div>
        <label className="font-medium block mb-1">Reading Passage Number</label>
        <select
          value={passageNumber}
          onChange={(e) => setPassageNumber(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              Passage {num}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="font-medium block mb-1">Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Optional title"
        />
      </div>

      {/* Passage */}
      <div>
        <label className="font-medium block mb-1">Passage</label>
        <ReactQuill
          theme="snow"
          value={passage}
          onChange={setPassage}
          modules={quillModules}
          className="bg-white"
          placeholder="Write or paste passage text here..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {isEdit ? 'Save Changes' : 'Save Prompt'}
        </button>
        <a
          href="/admin-dashboard/toefl/prompts/reading"
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 text-center"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
