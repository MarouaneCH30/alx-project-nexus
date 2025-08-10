"use client"

import Link from "next/link"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { addItem } from "@/store/cartSlice"
import type { Product } from "@/types/product"

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center text-yellow-400">
      {"★".repeat(full)}{half ? "½" : ""}<span className="ml-1 text-white/60 text-xs">({rating.toFixed(1)})</span>
    </div>
  )
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch()

  const handleAdd = () => {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }))
    // optional toast if you installed sonner:
    // toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/70 text-white shadow-lg transition will-change-transform hover:-translate-y-1 hover:border-red-500/60 hover:shadow-red-900/20">
      <Link href={`/products/${product.id}`} className="block relative">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={600}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          priority
        />
        {/* subtle top gradient on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      <div className="p-5">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="line-clamp-1 text-lg font-semibold tracking-wide">{product.name}</h3>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-xl font-extrabold">${product.price.toFixed(2)}</div>
          <Stars rating={product.rating} />
        </div>

        <div className="mt-1 text-xs text-white/60">{product.reviewsCount} reviews</div>

        <button
          onClick={handleAdd}
          className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/50"
        >
          Add to Cart
        </button>
      </div>

      {/* red ring glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-red-500/0 transition group-hover:ring-4 group-hover:ring-red-500/20" />
    </div>
  )
}
