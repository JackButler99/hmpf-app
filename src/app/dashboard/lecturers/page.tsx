'use client';

import Link from 'next/link'; 
import { useEffect, useState } from 'react';

export default function LecturersPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  // Debounced search logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchLecturers(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchLecturers = async (searchQuery: string) => {
    try {
      const res = await fetch(`/api/lecturers?q=${searchQuery}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to fetch lecturers:', err);
    }
  };

  const handleSelect = (lecturer: any) => {
    setSelectedLecturer(lecturer);
    setQuery(lecturer.name);
    setSuggestions([]);
  };

  const handleManualSearch = () => {
    if (query.trim()) {
      fetchLecturers(query);
    }
  };

  // Focusing on the hidden input to confuse autofill
  useEffect(() => {
    const hiddenInput = document.getElementById('hidden-autofill-prevent') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.focus();
    }
  }, []);

  return (
    <div className=" text-gray-900 p-6 bg-gray-50 min-h-screen">
      <Link
        href="/dashboard" // or your actual dashboard route
        className="inline-block mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
      >
        ← Back to Dashboard
  </Link>
      <h1 className="text-3xl text-gray-800 font-bold mb-6">Lecturer Contact Finder</h1>

      <div className="relative max-w-xl text-gray-700 mx-auto">
        {/* Hidden input to trick autofill */}
        <input
          id="hidden-autofill-prevent"
          type="text"
          name="fake-username"
          autoComplete="off"
          className="hidden"
        />

        <div className="flex gap-2">
          <input
            type="text"
            name="nope"  // Use a unique name to confuse autofill
            autoComplete="new-password" // More aggressive autofill prevention
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedLecturer(null);
            }}
            placeholder="Enter lecturer's name..."
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManualSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* Suggestion list */}
        {suggestions.length > 0 && (
          <ul className="absolute z-30 w-full bg-white border rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((lecturer: any) => (
              <li
                key={lecturer._id}
                onClick={() => handleSelect(lecturer)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {lecturer.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Lecturer */}
      {selectedLecturer && (
        <div className="mt-18 max-w-xl mx-auto bg-white shadow-md rounded-md p-4 border">
          <h1 className="text-2xl pt-2 pb-4">{selectedLecturer.name || 'Not Available'}</h1>
          <h2 className="text-xl font-semibold mb-2">Phone Number</h2>
          <p className="text-lg">{selectedLecturer.phone || 'Not Available'}</p>
        </div>
      )}
    </div>
  );
}
