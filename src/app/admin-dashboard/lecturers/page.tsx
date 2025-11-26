'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function LecturerManagementPage() {
  const { data: session } = useSession();

  const [lecturers, setLecturers] = useState([]);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    phones: [""],
    research_fields: [""],
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // FETCH
  const fetchLecturers = async () => {
    const res = await fetch(`/api/lecturers?page=${currentPage}&limit=${limit}`);
    const json = await res.json();

    setLecturers(json.items);
    setTotal(json.total);
  };

  useEffect(() => {
    fetchLecturers();
  }, [currentPage]);

  // SUBMIT FORM
  const handleSubmit = async () => {
    const isEdit = !!formData._id;

    const res = await fetch(
      isEdit ? `/api/lecturers/${formData._id}` : "/api/lecturers",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) {
      setFormData({
        _id: "",
        name: "",
        phones: [""],
        research_fields: [""],
      });
      setIsFormVisible(false);
      fetchLecturers();
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/lecturers/${id}`, { method: "DELETE" });
    if (res.ok) fetchLecturers();
  };

  const totalPages = Math.ceil(total / limit);

  // FORM array handlers
  const updateArrayField = (
    key: "phones" | "research_fields",
    index: number,
    value: string
  ) => {
    const updated = [...formData[key]];
    updated[index] = value;
    setFormData({ ...formData, [key]: updated });
  };

  const addArrayItem = (key: "phones" | "research_fields") => {
    setFormData({ ...formData, [key]: [...formData[key], ""] });
  };

  const removeArrayItem = (key: "phones" | "research_fields", index: number) => {
    const updated = formData[key].filter((_, i) => i !== index);
    setFormData({ ...formData, [key]: updated });
  };

  return (
    <div className="text-gray-900 p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">

      <Link
        className="inline-block mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        href="/admin-dashboard"
      >
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-5">Lecturer Management</h1>

      {session?.user?.isAdmin && (
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            setFormData({
              _id: "",
              name: "",
              phones: [""],
              research_fields: [""],
            });
            setIsFormVisible(true);
          }}
        >
          Add Lecturer
        </button>
      )}

      {/* FORM */}
      {isFormVisible && (
        <div className="mb-6 bg-white p-4 rounded shadow space-y-4">

          <h2 className="text-xl font-semibold">
            {formData._id ? "Edit Lecturer" : "Add Lecturer"}
          </h2>

          <input
            className="border p-2 w-full"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          {/* Phones */}
          <div className="space-y-2">
            <label className="font-semibold block">Phone Numbers</label>

            {formData.phones.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="border p-2 w-full"
                  value={p}
                  onChange={(e) => updateArrayField("phones", i, e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-2 rounded"
                  onClick={() => removeArrayItem("phones", i)}
                >
                  -
                </button>
              </div>
            ))}

            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() => addArrayItem("phones")}
            >
              + Add phone
            </button>
          </div>

          {/* Research Fields */}
          <div className="space-y-2">
            <label className="font-semibold block">Research Fields</label>

            {formData.research_fields.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="border p-2 w-full"
                  value={f}
                  onChange={(e) =>
                    updateArrayField("research_fields", i, e.target.value)
                  }
                />
                <button
                  className="bg-red-500 text-white px-2 rounded"
                  onClick={() => removeArrayItem("research_fields", i)}
                >
                  -
                </button>
              </div>
            ))}

            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() => addArrayItem("research_fields")}
            >
              + Add field
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              {formData._id ? "Update" : "Add"}
            </button>

            <button
              className="bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setIsFormVisible(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {lecturers.map((lec: any) => (
          <div
            key={lec._id}
            className="bg-white p-4 rounded shadow flex justify-between hover:bg-gray-100"
          >
            <div>
              <h3 className="font-bold">{lec.name}</h3>

              {lec.phones?.length > 0 && (
                <p className="text-sm text-gray-700">
                  📞 {lec.phones.join(", ")}
                </p>
              )}

              {lec.research_fields?.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  🔬 {lec.research_fields.join(", ")}
                </p>
              )}
            </div>

            {session?.user?.isAdmin && (
              <div className="flex gap-2">
                <button
                  className="bg-yellow-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setFormData(lec);
                    setIsFormVisible(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(lec._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
}
