"use client"

import { useMemo, useRef, useState, UIEvent, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { products } from "@/data/products"
import { useDispatch } from "react-redux"
import { addItem } from "@/store/cartSlice"

export default function NewArrivals() {
  const dispatch = useDispatch()

  // Pick products flagged as new; fallback to all
  const items = useMemo(() => {
    const flagged = products.filter((p: any) => p.isNewArrival || p.isNew)
    return (flagged.length ? flagged : products).slice(0, 10)
  }, [])

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)

  // Snap helpers
  const slideTo = (index: number) => {
    if (!viewportRef.current) return
    const vp = viewportRef.current
    const slide = vp.children[index] as HTMLElement | undefined
    if (slide) {
      vp.scrollTo({ left: slide.offsetLeft, behavior: "smooth" })
      setActive(index)
    }
  }
  const next = () => slideTo(Math.min(active + 1, items.length - 1))
  const prev = () => slideTo(Math.max(active - 1, 0))

  // Track current slide based on scroll
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const width = el.clientWidth
    const x = el.scrollLeft
    const i = Math.round(x / width)
    setActive(Math.max(0, Math.min(i, items.length - 1)))
  }

  // Keep slide centered on resize
  useEffect(() => {
    const onResize = () => slideTo(active)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!items.length) return null

  return (
    <section className="bg-black text-white overflow-x-hidden">
      {/* Section header */}
      <div className="mx-auto w-full max-w-7xl px-6 pt-14">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Just In
        </p>
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
          New Arrivals
        </h2>
      </div>

      {/* Full-bleed slider without causing page horizontal scroll */}
      <div className="relative w-full overflow-hidden">
        {/* Arrows (kept inside container) */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="group absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6 text-white drop-shadow group-hover:scale-105 transition" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="group absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6 text-white drop-shadow group-hover:scale-105 transition" />
        </button>

        {/* Hero slider */}
        <div
          ref={viewportRef}
          onScroll={onScroll}
          aria-live="polite"
          className="no-scrollbar relative flex h-[80vh] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {items.map((p, i) => (
            <div key={p.id} className="relative h-full w-full snap-start shrink-0">
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  priority={i < 2}
                  className="object-cover"
                  sizes="100vw"
                />
                {/* subtle vignette */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
              </div>

              {/* Caption glass */}
              <div className="absolute bottom-8 left-1/2 z-10 w-[min(92vw,900px)] -translate-x-1/2">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-black/40 px-5 py-4 backdrop-blur-md shadow-lg">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-white/70">{p.brand}</div>
                    <h3 className="truncate text-xl font-semibold">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-red-500">${p.price.toFixed(2)}</div>
                    <button
                      onClick={() =>
                        dispatch(
                          addItem({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            image: p.image,
                            quantity: 1,
                          }),
                        )
                      }
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold shadow hover:bg-red-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Dots */}
                <div className="mt-3 flex justify-center gap-1.5">
                  {items.map((_, j) => (
                    <button
                      key={j}
                      onClick={() => slideTo(j)}
                      aria-label={`Go to slide ${j + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        j === active ? "w-8 bg-red-500" : "w-3 bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filmstrip */}
        <div className="no-scrollbar relative z-10 mx-auto -mt-6 mb-12 w-[min(96vw,1100px)] rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
          <div className="flex gap-3 overflow-x-auto">
            {items.map((p, i) => (
              <button
                key={p.id + "-thumb"}
                onClick={() => slideTo(i)}
                className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition
                  ${i === active ? "border-red-500 ring-2 ring-red-500/40" : "border-white/15 hover:border-white/35"}`}
                aria-label={`Go to ${p.name}`}
              >
                <Image src={p.image} alt={p.name} fill sizes="80px" className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              </button>
            ))}
          </div>
          {/* mini labels */}
          <div className="mt-2 grid grid-cols-6 gap-2 text-[11px] text-white/70 sm:grid-cols-8 md:grid-cols-10">
            {items.map((p, i) => (
              <div key={p.id + "-label"} className={`truncate ${i === active ? "text-white" : ""}`}>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
