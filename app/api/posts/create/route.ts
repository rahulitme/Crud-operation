import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import { generateSlug, sanitizeHtml } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const sanitizedContent = sanitizeHtml(content)

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug })
    if (existingPost) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 409 })
    }

    const post = new Post({
      title,
      content: sanitizedContent,
      slug,
    })

    await post.save()

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
