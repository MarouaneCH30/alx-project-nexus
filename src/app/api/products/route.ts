import { NextResponse } from "next/server"
import { products as ALL } from "@/data/products"
import type { Product } from "@/types/product"

function matchesFilters(p: Product, q: string, cats: Set<string>, brands: Set<string>,
                       minPrice?: number, maxPrice?: number, minRating?: number | null) {
  const s = q.trim().toLowerCase()
  const searchOk =
    s.length === 0 ||
    p.name.toLowerCase().includes(s) ||
    p.brand.toLowerCase().includes(s)

  const catOk = cats.size === 0 || cats.has(p.category)
  const brandOk = brands.size === 0 || brands.has(p.brand)
  const priceOk =
    (minPrice == null || p.price >= minPrice) &&
    (maxPrice == null || p.price <= maxPrice)
  const ratingOk = minRating == null || p.rating >= minRating

  return searchOk && catOk && brandOk && priceOk && ratingOk
}

function sortProducts(list: Product[], sort: string) {
  switch (sort) {
    case "price-asc":
      return [...list].sort((a, b) => a.price - b.price)
    case "price-desc":
      return [...list].sort((a, b) => b.price - a.price)
    case "rating-desc":
      return [...list].sort((a, b) => b.rating - a.rating)
    default:
      return list // relevance: original order
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get("q") ?? ""

  const catStr = url.searchParams.get("categories") ?? ""
  const cats = new Set(catStr ? catStr.split(",") : [])

  const brandStr = url.searchParams.get("brands") ?? ""
  const brands = new Set(brandStr ? brandStr.split(",") : [])

  const minPrice = url.searchParams.get("minPrice")
  const maxPrice = url.searchParams.get("maxPrice")
  const minRating = url.searchParams.get("minRating")

  const sort = url.searchParams.get("sort") ?? "relevance"

  const limit = Number(url.searchParams.get("limit") ?? 12)
  const cursor = Number(url.searchParams.get("cursor") ?? 0)

  const filtered = ALL.filter((p) =>
    matchesFilters(
      p,
      q,
      cats,
      brands,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      minRating ? Number(minRating) : null
    )
  )

  const sorted = sortProducts(filtered, sort)

  const start = cursor
  const end = Math.min(cursor + limit, sorted.length)
  const slice = sorted.slice(start, end)
  const nextCursor = end < sorted.length ? end : null

  return NextResponse.json({
    items: slice,
    total: sorted.length,
    nextCursor,
  })
}
