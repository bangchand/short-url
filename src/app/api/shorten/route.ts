import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

function generateCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let res = ""
  for (let i = 0; i < length; i++) {
    res += chars[Math.floor(Math.random() * chars.length)]
  }
  return res
}

export async function POST(req: Request) {
  const { url } = await req.json()
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db()
  const collection = db.collection("short_urls")

  const code = generateCode()

  await collection.insertOne({
    code,
    original_url: url,
    clicks: 0,
    created_at: new Date()
  })

  return NextResponse.json({
    short_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`
  })
}
