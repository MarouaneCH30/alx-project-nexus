// src/components/NewsSection.tsx
"use client"

import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"

type NewsItem = {
  id: string
  title: string
  url: string
  image: string | null
  excerpt: string
  byline?: string
  publishedAt?: string
  source?: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Whitelist of martial-arts keywords (case-insensitive)
const MARTIAL_KEYWORDS = [
  "martial art",
  "karate",
  "judo",
  "bjj",
  "brazilian jiu-jitsu",
  "jiu jitsu",
  "taekwondo",
  "kung fu",
  "muay thai",
  "kickboxing",
  "wrestling",
  "grappling",
  "mma",
  "ufc",
  "one championship",
  "bellator",
  "pankration",
  "sambo",
]

// Optional: exclude obvious non-relevant sports/noise
const EXCLUDE_WORDS = [
  "football",
  "soccer",
  "tennis",
  "golf",
  "politics",
  "election",
  "stock",
  "economy",
]

// turn HTML trailText into plain text
function stripHtml(input: string) {
  if (!input) return ""
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

function isRelevant(item: NewsItem) {
  const hay = (item.title + " " + item.excerpt).toLowerCase()

  const hasKeyword = MARTIAL_KEYWORDS.some(k => hay.includes(k))
  if (!hasKeyword) return false

  const excluded = EXCLUDE_WORDS.some(k => hay.includes(k))
  return !excluded
}

export default function NewsSection() {
  const { data, error, isLoading } = useSWR<NewsItem[]>("/api/news", fetcher, {
    revalidateOnFocus: false,
  })

  // Client-side relevance filter + limit
  const items = (data ?? [])
    .map(i => ({ ...i, excerpt: stripHtml(i.excerpt) }))
    .filter(isRelevant)
    .slice(0, 8)

  return (
    <section className="bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-wide">
            Martial Arts News
          </h2>
          <span className="text-sm text-white/60">Powered by The Guardian</span>
        </div>

        {/* Loading / error / empty states */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-lg border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            Couldn’t load news right now. Please try again later.
          </p>
        )}

        {!isLoading && !error && items.length === 0 && (
          <p className="text-white/70">No recent martial arts articles found.</p>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-white/25"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={
                      item.image ??
                      "/news-fallback.jpg" /* add an optional local fallback */
                    }
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={!item.image} // local fallback ok
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                </div>

                {/* Text */}
                <div className="flex h-40 flex-col justify-between p-4">
                  <div>
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-white/70">
                        {item.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                    <span>{item.byline ?? "The Guardian"}</span>
                    {item.publishedAt && (
                      <time dateTime={item.publishedAt}>
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </time>
                    )}
                  </div>
                </div>

                {/* Click overlay */}
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  aria-label={`Read: ${item.title}`}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
