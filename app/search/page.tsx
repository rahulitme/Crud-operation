import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from "lucide-react"
import { SearchBar } from "@/components/search-bar"

async function searchPosts(query: string, page = 1) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/posts/search?q=${encodeURIComponent(
        query,
      )}&page=${page}`,
      { cache: "no-store" },
    )
    if (!res.ok) throw new Error("Failed to search posts")
    return res.json()
  } catch (error) {
    console.error("Error searching posts:", error)
    return { posts: [], pagination: { total: 0, pages: 0, page: 1 } }
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""
  const page = Number.parseInt(params.page || "1")

  const { posts, pagination } = await searchPosts(query, page)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        {query && (
          <p className="text-gray-600 mb-4">
            {pagination.total} result{pagination.total !== 1 ? "s" : ""} for "{query}"
          </p>
        )}

        <div className="max-w-md">
          <SearchBar />
        </div>
      </div>

      <div className="grid gap-6">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found</p>
              {query && <p className="text-gray-400 mt-2">Try searching with different keywords</p>}
            </CardContent>
          </Card>
        ) : (
          posts.map((post: any) => (
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
                {post.categories && post.categories.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {post.categories.map((category: string) => (
                      <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </CardHeader>
              {post.excerpt && (
                <CardContent>
                  <p className="text-gray-600">{post.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
            <Link key={pageNum} href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}>
              <Button variant={pageNum === pagination.page ? "default" : "outline"} size="sm">
                {pageNum}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
