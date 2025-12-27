import { NextResponse } from "next/server"

export const runtime = "edge"

const URLS: Record<string, string> = {
  yt: "https://youtube.com",
  gh: "https://github.com",
  kopi: "https://maps.google.com"
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const target = URLS[code]

  if (!target) {
    return new NextResponse("Not Found", { status: 404 })
  }

  return NextResponse.redirect(target, 302)
}
