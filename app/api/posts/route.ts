import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import { generateSlug } from "@/lib/utils"

export async function GET() {
  try {
    await dbConnect()
    const posts = await Post.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const slug = generateSlug(title)

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug })
    if (existingPost) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 400 })
    }

    const post = new Post({
      title,
      content,
      slug,
    })

    await post.save()

    return NextResponse.json({ message: "Post created successfully", post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
