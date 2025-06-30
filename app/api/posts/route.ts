import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"

export async function GET() {
  try {
    await dbConnect()

    const posts = await Post.find({}).sort({ createdAt: -1 }).select("title slug createdAt updatedAt")

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
