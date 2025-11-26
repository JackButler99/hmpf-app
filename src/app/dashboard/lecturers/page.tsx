"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link"; 

type Lecturer = {
  _id: string;
  name: string;
  research_fields: string[];
  phones?: string[];
};

type ApiResult = {
  page: number;
  limit: number;
  total: number;
  items: Lecturer[];
};

export default function Home() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  // debounce input
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedQ(q);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const canSearch = debouncedQ.trim().length >= 2;

  useEffect(() => {
    const ctrl = new AbortController();

    if (!canSearch) {
      setData({ page: 1, limit, total: 0, items: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const url = `/api/lecturers?q=${encodeURIComponent(debouncedQ)}&page=${page}&limit=${limit}`;
    fetch(url, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((res) => setData(res))
      .catch(() => setData({ page: 1, limit, total: 0, items: [] }))
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [debouncedQ, page, canSearch]);

  const totalPages = useMemo(
    () => (data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1),
    [data]
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Direktori Dosen
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Cari nama atau bidang riset untuk menemukan kontak yang tepat.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-6">
        {/* Search Bar */}
        <div className="rounded-xl border shadow-sm bg-white overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 focus-within:ring-2 focus-within:ring-slate-900/10">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-slate-400 shrink-0"
            >
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.57-4.23A6.5 6.5 0 1 0 9.5 15.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14Z"
              />
            </svg>
            <input
              aria-label="Cari dosen"
              className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900"
              placeholder="Ketik minimal 2 karakter"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-slate-500 hover:text-slate-700 rounded-md px-2 py-1"
                aria-label="Bersihkan pencarian"
                title="Bersihkan"
              >
                ✕
              </button>
            )}
          </div>

          {/* Info Bar */}
          <div className="border-t bg-slate-50/60 px-4 py-2 text-xs text-slate-600 flex items-center justify-between">
            {!canSearch ? (
              <span>Mulai ketik untuk menampilkan hasil.</span>
            ) : loading ? (
              <span>Mencari…</span>
            ) : (
              <span>Ditemukan {data?.total ?? 0} hasil</span>
            )}

            {canSearch && (data?.total ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <PagerButton onClick={() => setPage(1)} disabled={page <= 1} label="Awal" />
                <PagerButton
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  label="Sebelumnya"
                />
                <span className="mx-2 tabular-nums text-slate-700">
                  Hal. {page} / {totalPages}
                </span>
                <PagerButton
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  label="Berikutnya"
                />
                <PagerButton
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                  label="Akhir"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {!canSearch ? (
            <EmptyState
              title="Belum ada pencarian"
              desc="Masukkan kata kunci untuk melihat daftar dosen."
            />
          ) : loading ? (
            <SkeletonList />
          ) : (data?.items.length ?? 0) === 0 ? (
            <EmptyState
              title="Tidak ada hasil"
              desc="Coba kata kunci lain atau periksa ejaan pencarian Anda."
            />
          ) : (
            <ul className="grid grid-cols-1 gap-4">
              {data!.items.map((it) => (
                <li
                  key={it._id}
                  className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-slate-900">{it.name}</div>
                      {it.research_fields?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {it.research_fields.map((f, i) => (
                            <span
                              key={f + i}
                              className="inline-flex items-center rounded-full border px-2.5 py-1 text-sm text-slate-700 bg-slate-50"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {it.phones?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {it.phones.map((ph, i) => (
                        <span
                          key={ph + i}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-700"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.31.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C12.85 21 3 11.15 3 0.99A1 1 0 0 1 4 0h3.5a1 1 0 0 1 1 1c0 1.27.2 2.47.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z"
                            />
                          </svg>
                          {ph}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

/* --- Sub Components --- */

function PagerButton({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-xs rounded-md border px-2.5 py-1.5 disabled:opacity-40 hover:bg-slate-50"
    >
      {label}
    </button>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-white p-8 text-center text-slate-700">
      <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-slate-100 grid place-content-center">
        <span className="text-lg">🔎</span>
      </div>
      <h2 className="text-slate-900 font-semibold">{title}</h2>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
    </div>
  );
}

function SkeletonList() {
  return (
    <ul className="grid grid-cols-1 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="rounded-xl border bg-white p-4">
          <div className="h-4 w-40 bg-slate-200/70 rounded animate-pulse" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-28 bg-slate-200/70 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-slate-200/70 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-slate-200/70 rounded-full animate-pulse" />
          </div>
          <div className="mt-3 h-5 w-48 bg-slate-200/70 rounded animate-pulse" />
        </li>
      ))}
    </ul>
  );
}
