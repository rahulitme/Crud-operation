import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

async function getPostsByCategory(category: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/posts/search?category=${encodeURIComponent(
        category,
      )}`,
      { cache: "no-store" },
    )
    if (!res.ok) throw new Error("Failed to fetch posts")
    return res.json()
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { posts: [] }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const { posts } = await getPostsByCategory(decodedCategory)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Category: {decodedCategory}</h1>
        <p className="text-gray-600">
          {posts.length} post{posts.length !== 1 ? "s" : ""} in this category
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post: any) => (
          <Card key={post._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.author && <span className="ml-4">by {post.author.name}</span>}
              </div>
            </CardHeader>
            {post.excerpt && (
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
