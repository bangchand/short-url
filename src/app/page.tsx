"use client"

import { useState } from "react"
import Image from "next/image"

export default function Home() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setShortUrl("")

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setShortUrl(data.short_url)
      setUrl("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-xl rounded-2xl bg-white p-8 shadow dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={80}
            height={20}
            className="dark:invert"
          />

          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">
            Short URL
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-4"
          >
            <input
              type="url"
              required
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {shortUrl && (
            <div className="w-full rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
              <p className="mb-1 text-zinc-600 dark:text-zinc-400">
                Short URL
              </p>
              <a
                href={shortUrl}
                target="_blank"
                className="break-all font-medium text-blue-600 hover:underline"
              >
                {shortUrl}
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
