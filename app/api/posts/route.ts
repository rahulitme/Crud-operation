import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"

// GET all posts
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const posts = await Post.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    const total = await Post.countDocuments({})

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { title, content, excerpt } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug })
    if (existingPost) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 400 })
    }

    const post = new Post({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      slug,
    })

    await post.save()

    return NextResponse.json({ message: "Post created successfully", post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
