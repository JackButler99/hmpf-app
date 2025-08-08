'use client';

import Link from 'next/link'; 
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function LecturerManagementPage() {
  const { data: session } = useSession();
  const [lecturers, setLecturers] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', _id: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const fetchLecturers = async () => {
    const res = await fetch(`/api/lecturers?page=${currentPage}&limit=${limit}`);
    const result = await res.json();
    setLecturers(result.data);
    setTotal(result.total);
  };

  useEffect(() => {
    fetchLecturers();
  }, [currentPage]);

  const handleSubmit = async () => {
    const isEdit = !!formData._id;

    const res = await fetch(isEdit ? `/api/lecturers/${formData._id}` : '/api/lecturers', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: '', phone: '', _id: '' });
      setIsFormVisible(false);
      fetchLecturers();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/lecturers/${id}`, { method: 'DELETE' });
    if (res.ok) fetchLecturers();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="text-gray-900 p-6 max-w-3xl mx-auto bg-gray-50 min-h-screen">
      <Link
        href="/admin-dashboard"
        className="inline-block mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
      >
        ← Back to Admin Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-4">Lecturer Management</h1>

      {/* Form Toggle */}
      {session?.user?.isAdmin && (
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            setFormData({ name: '', phone: '', _id: '' });
            setIsFormVisible(true);
          }}
        >
          Add Lecturer
        </button>
      )}

      {/* Unified Form */}
      {isFormVisible && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{formData._id ? 'Edit Lecturer' : 'Add Lecturer'}</h2>
          <input
            className="border p-2 w-full mb-2"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
              {formData._id ? 'Update' : 'Add'}
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsFormVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lecturer List */}
      <div>
        {lecturers.map((lecturer: any) => (
          <div key={lecturer._id} className="bg-white p-4 mb-2 hover:bg-gray-100 rounded shadow flex justify-between">
            <div>
              <h3 className="font-bold">{lecturer.name}</h3>
              <p>{lecturer.phone}</p>
            </div>
            {session?.user?.isAdmin && (
              <div className="flex gap-2">
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-white px-2 py-1 rounded"
                  onClick={() => {
                    setFormData(lecturer);
                    setIsFormVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(lecturer._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
