// src/components/SearchDrawer.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { X, Search } from "lucide-react"
import Link from "next/link"

type Props = {
  open: boolean
  onClose: () => void
}

export default function SearchDrawer({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState("")

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Autofocus when open
  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  const quickLinks = [
    { label: "Boxing Gloves", href: "/shop?cat=boxing" },
    { label: "BJJ Gi", href: "/shop?cat=bjj-gi" },
    { label: "Shin Guards", href: "/shop?cat=shin" },
    { label: "Headgear", href: "/shop?cat=headgear" },
  ]

  return (
    <>
      {/* Dark overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Top sliding search bar */}
      <div
        className={`fixed left-0 right-0 top-0 z-50 transform transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-full"
        } bg-black text-white shadow-lg`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Search</h2>
          <button
            aria-label="Close search"
            onClick={onClose}
            className="rounded p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search field */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/5 px-3 py-2">
            <Search className="h-5 w-5 text-white/70" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gear, brands, or categories…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/50"
            />
          </div>
          <p className="mt-2 text-xs text-white/50">Press Esc to close</p>
        </div>

        {/* Results / Quick links */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {query.trim().length === 0 ? (
            <>
              <p className="mb-3 text-sm text-white/70">Quick links</p>
              <ul className="space-y-2">
                {quickLinks.map((q) => (
                  <li key={q.href}>
                    <Link
                      href={q.href}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-white/10"
                      onClick={onClose}
                    >
                      {q.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="rounded-md border border-white/10 p-4 text-sm text-white/70">
              Searching for <span className="font-semibold text-white">{query}</span>…
              <div className="mt-1 text-xs text-white/50">
                (We’ll hook this up to real results later.)
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
