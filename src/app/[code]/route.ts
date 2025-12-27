import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

interface ShortUrl {
  code: string
  original_url: string
  clicks: number
  created_at: Date
}

export const runtime = "nodejs"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const client = await clientPromise
  const db = client.db()
  const collection = db.collection<ShortUrl>("short_urls")

  const doc = await collection.findOne({ code })

  if (!doc) {
    return new NextResponse("Not Found", { status: 404 })
  }

  await collection.updateOne(
    { code },
    { $inc: { clicks: 1 } }
  )

  return NextResponse.redirect(doc.original_url, 302)
}
