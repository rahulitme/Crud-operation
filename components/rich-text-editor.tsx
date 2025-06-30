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
        // Add image upload handler
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
                const response = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                })

                if (response.ok) {
                  const data = await response.json()
                  const range = quillRef.current.getSelection()
                  quillRef.current.insertEmbed(range.index, "image", data.url)
                }
              } catch (error) {
                console.error("Image upload failed:", error)
              }
            }
          }
        }

        // Update the modules configuration to include the custom image handler
        const modules = {
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
        }

        const quill = new Quill.default(editorRef.current!, {
          theme: "snow",
          placeholder,
          modules: modules,
        })

        quill.on("text-change", () => {
          onChange(quill.root.innerHTML)
        })

        if (value) {
          quill.root.innerHTML = value
        }

        quillRef.current = quill
      })
    }
  }, [])

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return (
    <div className={cn("bg-white", className)}>
      <div ref={editorRef} className="min-h-[300px]" />
    </div>
  )
}
