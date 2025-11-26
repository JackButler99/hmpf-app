'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

type Section = 'reading' | 'listening' | 'grammar';

type Question = {
  _id: string;
  section: Section;
  questionText: string;
};

type SortKey = keyof Question;

export default function QuestionListPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState<'all' | Section>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>('section');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/toefl/questions')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
        <LoadingSpinner />
      </main>
    );
  }

  // Filtering
  const filteredQuestions =
    filter === 'all'
      ? questions
      : questions.filter((q) => q.section === filter);

  // Sorting
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const valA = (a[sortKey] || '').toString().toLowerCase();
    const valB = (b[sortKey] || '').toString().toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = sortedQuestions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  async function handleDelete(id: string) {
    if (!confirm('Are you sure want to delete this question?')) return;
    await fetch(`/api/toefl/questions/${id}`, { method: 'DELETE' });
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">

      {/* HEADER */}
      <div className="
        flex flex-col lg:flex-row 
        lg:items-center lg:justify-between
        gap-4 mb-8
        text-center lg:text-left
      ">

        {/* Back Button */}
        <Link href="/admin-dashboard">
          <button className="
            flex items-center gap-2
            px-4 py-2.5 cursor-pointer
            rounded-xl
            bg-slate-800 text-white
            shadow hover:bg-slate-900
            transition
            mx-auto lg:mx-0
            w-40 justify-center
          ">
            <svg xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        </Link>

        {/* Title */}
        <h1 className="
          text-3xl sm:text-4xl font-bold text-slate-900
          mx-auto lg:mx-0
        ">
          Manage TOEFL Questions
        </h1>

        {/* Add button */}
        <Link href="/admin-dashboard/toefl/questions/new">
          <button className="
            flex items-center gap-2 cursor-pointer
            bg-blue-600 text-white px-5 py-2.5 
            rounded-xl shadow hover:bg-blue-700 transition
            mx-auto lg:mx-0
            w-40 justify-center
          ">
            <Plus className="w-5 h-5" />
            Add
          </button>
        </Link>

      </div>



      {/* FILTERS */}
      <div className="
        mb-6 
        flex flex-col sm:flex-row 
        flex-wrap items-start sm:items-center 
        gap-4 
        bg-white/70 backdrop-blur-xl 
        rounded-xl p-4 
        border border-slate-200 
        shadow
      ">
        {/* Filter */}
        <div className="w-full sm:w-auto">
          <label className="mr-2 text-sm font-medium">Filter Section:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="border px-3 py-1.5 rounded-lg bg-white shadow-sm w-full sm:w-auto"
          >
            <option value="all">All</option>
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
            <option value="grammar">Grammar</option>
          </select>
        </div>

        {/* Rows */}
        <div className="w-full sm:w-auto">
          <label className="mr-2 text-sm font-medium">Rows per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-3 py-1.5 rounded-lg bg-white shadow-sm w-full sm:w-auto"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Page info */}
        <p className="text-sm text-slate-600 w-full sm:ml-auto text-left sm:text-right">
          Page <span className="font-semibold">{currentPage}</span> of {totalPages || 1}
        </p>
      </div>

      {/* TABLE (fully responsive) */}
      <div className="
        bg-white/80 backdrop-blur-xl 
        border border-slate-200 shadow-xl 
        rounded-xl overflow-hidden
        overflow-x-auto
      ">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900">
            <tr>
              <SortableHeader label="Section" sortKey="section" currentKey={sortKey} order={sortOrder} onSort={handleSort} />
              <SortableHeader label="Question" sortKey="questionText" currentKey={sortKey} order={sortOrder} onSort={handleSort} />
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedQuestions.map((q) => (
              <tr key={q._id} className="border-t hover:bg-slate-100 transition">
                <td className="p-4 capitalize">{q.section}</td>
                <td className="p-4">{q.questionText.slice(0, 100)}...</td>

                <td className="p-4 flex flex-col sm:flex-row gap-2">
                  <Link href={`/admin-dashboard/toefl/questions/${q._id}/edit`}>
                    <span className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer">
                      <Pencil size={16} /> Edit
                    </span>
                  </Link>

                  <span
                    onClick={() => handleDelete(q._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 size={16} /> Delete
                  </span>
                </td>
              </tr>
            ))}

            {paginatedQuestions.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-slate-500">
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          label="Previous"
        />

        <span className="text-slate-700 font-semibold">
          {currentPage} / {totalPages}
        </span>

        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          label="Next"
        />
      </div>
    </main>
  );
}

/* SORTABLE HEADER */
function SortableHeader({
  label,
  sortKey,
  currentKey,
  order,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  order: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
}) {
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="p-4 cursor-pointer select-none hover:bg-slate-200 transition"
    >
      <div className="flex items-center gap-1 font-semibold">
        {label}
        {currentKey === sortKey &&
          (order === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </div>
    </th>
  );
}

/* PAGINATION BUTTON */
function PaginationButton({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-2 rounded-xl font-semibold shadow
        transition 
        ${
          disabled
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }
      `}
    >
      {label}
    </button>
  );
}
