"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current && !quillRef.current) {
      import("quill").then((Quill) => {
        // Custom image upload handler
        const imageHandler = () => {
          const input = document.createElement("input")
          input.setAttribute("type", "file")
          input.setAttribute("accept", "image/*")
          input.click()

          input.onchange = async () => {
            const file = input.files?.[0]
            if (file) {
              const formData = new FormData()
              formData.append("file", file)

              try {
                console.log("Uploading image...")
                const response = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                })

                const data = await response.json()
                console.log("Upload response:", data)

                if (response.ok && data.success) {
                  const range = quillRef.current.getSelection(true)
                  quillRef.current.insertEmbed(range.index, "image", data.url)
                  quillRef.current.setSelection(range.index + 1)
                  console.log("Image inserted:", data.url)
                } else {
                  console.error("Upload failed:", data.error)
                  alert("Image upload failed: " + (data.error || "Unknown error"))
                }
              } catch (error) {
                console.error("Image upload failed:", error)
                alert("Image upload failed. Please try again.")
              }
            }
          }
        }

        const quill = new Quill.default(editorRef.current!, {
          theme: "snow",
          placeholder,
          modules: {
            toolbar: {
              container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["blockquote", "code-block"],
                ["link", "image"],
                ["clean"],
              ],
              handlers: {
                image: imageHandler,
              },
            },
          },
        })

        quill.on("text-change", () => {
          const html = quill.root.innerHTML
          onChange(html)
        })

        if (value && value !== "<p><br></p>") {
          quill.root.innerHTML = value
        }

        quillRef.current = quill
      })
    }
  }, [])

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      if (value && value !== "<p><br></p>") {
        quillRef.current.root.innerHTML = value
      }
    }
  }, [value])

  return (
    <div className={cn("bg-white border rounded-md", className)}>
      <div ref={editorRef} className="min-h-[300px]" />
    </div>
  )
}
