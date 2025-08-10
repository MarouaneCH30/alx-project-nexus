"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

type CatItem = { label: string; href: string; image: string }
type CatSection = { title: string; items: CatItem[] }

const sections: CatSection[] = [
  {
    title: "Striking",
    items: [
      { label: "Boxing",    href: "/shop?cat=boxing",    image: "/boxing.jpg" },
      { label: "Muay Thai", href: "/shop?cat=muay-thai", image: "/muay-thai.jpg" },
      { label: "Kickboxing",href: "/shop?cat=kickboxing",image: "/kickboxing.jpg" },
    ],
  },
  {
    title: "Grappling",
    items: [
      { label: "BJJ / Gi",  href: "/shop?cat=bjj-gi",    image: "/bjj-gi.jpg" },
      { label: "Wresling",     href: "/shop?cat=wrestling",     image: "/wrestling.jpg" },
      { label: "Judo",      href: "/shop?cat=judo",      image: "/judo.jpg" },
    ],
  },
  {
    title: "Protection",
    items: [
      { label: "Headgear",   href: "/shop?cat=headgear",   image: "/headgear.jpg" },
      { label: "Shin Guards",href: "/shop?cat=shin",       image: "/shin.jpg" },
      { label: "Mouthguards",href: "/shop?cat=mouthguard", image: "/mouthguard.jpg" },
    ],
  },
]

export default function CategoriesMegaMenu() {
  const defaultPreview = sections[0].items[0]
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<CatItem>(defaultPreview)

  // 🔸 linger timer so the menu doesn't close instantly
  const closeTimer = useRef<NodeJS.Timeout | null>(null)
  const LINGER_MS = 300

  const handleEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpen(true)
  }

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), LINGER_MS)
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* trigger */}
      <button className="text-sm font-semibold tracking-wide hover:text-red-500 transition">
        CATEGORIES
      </button>

      {/* panel */}
      {open && (
        <div className="absolute left-1/2 z-50 mt-3 -translate-x-1/2 rounded-lg border border-white/10 bg-black/90 text-white shadow-xl backdrop-blur-md">
          <div className="grid min-w-[760px] grid-cols-4 gap-8 p-6">
            {/* columns */}
            <div className="col-span-3 grid grid-cols-3 gap-8">
              {sections.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/60">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="block text-sm hover:text-red-500"
                          onMouseEnter={() => setPreview(item)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* preview */}
            <div className="col-span-1">
              <div className="overflow-hidden rounded-md border border-white/10 bg-black/60">
                <Image
                  src={preview.image}
                  alt={preview.label}
                  width={420}
                  height={320}
                  className="h-52 w-full object-cover"
                  priority
                />
              </div>
              <div className="mt-3 text-sm text-white/80">{preview.label}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
