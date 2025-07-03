"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Pencil, Trash2, Plus, Eye } from "lucide-react"

interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      } else {
        setError("Failed to fetch posts")
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Error fetching posts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.slug !== slug))
      } else {
        alert("Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Error deleting post")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your blog posts</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/admin/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </Link>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <div className="grid gap-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">No posts found</p>
                <p className="text-gray-400 mt-2">Create your first blog post to get started</p>
                <Link href="/admin/create">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription>
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                        {post.updatedAt !== post.createdAt && (
                          <span className="ml-2">• Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/edit/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.slug)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
      </div>
    </div>
  )
}
