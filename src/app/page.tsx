"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setShortUrl(data.short_url);
      setUrl("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] px-4">
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-100">Shortlink</h1>
          <p className="mt-2 text-sm text-slate-400">
            Perpendek URL panjang dengan cepat
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-5"
        >
          <input
            type="url"
            required
            placeholder="Masukkan URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-blue-500 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:bg-slate-600"
          >
            {loading ? "Memproses..." : "Perpendek URL"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="mt-6 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Short URL</span>
              <button
                onClick={() => navigator.clipboard.writeText(shortUrl)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Salin
              </button>
            </div>

            <a
              href={shortUrl}
              target="_blank"
              className="block break-all text-sm text-slate-100 hover:underline"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
