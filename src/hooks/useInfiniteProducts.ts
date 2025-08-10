"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Product } from "@/types/product"

type Params = {
  q?: string
  categories?: string[]
  brands?: string[]
  minPrice?: string
  maxPrice?: string
  minRating?: number | null
  sort?: string
  limit?: number
}

export type InfiniteProductsResult = {
  items: Product[]
  total: number
  hasMore: boolean
  loading: boolean
  error: string | null
  loadMore: () => Promise<void>
  reset: () => Promise<void>
}

export function useInfiniteProducts(params: Params): InfiniteProductsResult {
  const {
    q = "",
    categories = [],
    brands = [],
    minPrice = "",
    maxPrice = "",
    minRating = null,
    sort = "",
    limit = 12,
  } = params

  const [items, setItems] = useState<Product[]>([])
  const [nextCursor, setNextCursor] = useState<number | null>(0)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const qs = useMemo(() => {
    const u = new URLSearchParams()
    if (q) u.set("q", q)
    if (categories.length) u.set("categories", categories.join(","))
    if (brands.length) u.set("brands", brands.join(","))
    if (minPrice !== "") u.set("minPrice", minPrice)
    if (maxPrice !== "") u.set("maxPrice", maxPrice)
    if (minRating != null) u.set("minRating", String(minRating))
    if (sort) u.set("sort", sort)
    u.set("limit", String(limit))
    return u.toString()
  }, [q, categories, brands, minPrice, maxPrice, minRating, sort, limit])

  const resetAndLoad = useCallback(async () => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    setLoading(true)
    setError(null)
    setItems([])
    setNextCursor(0)
    setTotal(0)

    try {
      const res = await fetch(`/api/products?cursor=0&${qs}`, { signal: ac.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as {
        items: Product[]
        nextCursor: number | null
        total: number
      }

      const map = new Map<string, Product>()
      data.items.forEach((p) => map.set(p.id, p))
      setItems(Array.from(map.values()))
      setNextCursor(data.nextCursor)
      setTotal(data.total)
    } catch (e: any) {
      if (e.name !== "AbortError") setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [qs])

  const loadMore = useCallback(async () => {
    if (loading || nextCursor == null) return

    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/products?cursor=${nextCursor}&${qs}`, {
        signal: ac.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as {
        items: Product[]
        nextCursor: number | null
        total: number
      }

      setItems((prev) => {
        const map = new Map(prev.map((p) => [p.id, p] as const))
        data.items.forEach((p) => map.set(p.id, p))
        return Array.from(map.values())
      })
      setNextCursor(data.nextCursor)
      setTotal(data.total)
    } catch (e: any) {
      if (e.name !== "AbortError") setError(e.message || "Failed to load more")
    } finally {
      setLoading(false)
    }
  }, [loading, nextCursor, qs])

  useEffect(() => {
    resetAndLoad()
    return () => abortRef.current?.abort()
  }, [resetAndLoad])

  return {
    items,
    total,
    hasMore: nextCursor != null,
    loading,
    error,
    loadMore,
    reset: resetAndLoad,
  }
}
