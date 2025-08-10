"use client"

import Image from "next/image"
import { useDispatch } from "react-redux"
import { addItem } from "@/store/cartSlice"
import { products } from "@/data/products" // adjust path if needed

export default function BestSellers() {
  const dispatch = useDispatch()

  // Only best sellers
  const bestSellers = products.filter((p) => p.isBestSeller)

  return (
    <section className="bg-black text-white py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <h2 className="mb-10 text-center text-3xl font-extrabold">Best Sellers</h2>

        {/* Option B: Auto-fit columns with min width */}
        <div className="grid w-full gap-6"
             style={{
               gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
             }}
        >
          {bestSellers.map((p) => (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-black/70 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <Image
                src={p.image}
                alt={p.name}
                width={600}
                height={450}
                className="h-64 w-full object-cover"
                priority
              />

              <div className="flex flex-col flex-1 p-5">
                <h3 className="line-clamp-1 text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-400">{p.brand}</p>

                <p className="mt-2 text-xl font-bold text-red-500">${p.price.toFixed(2)}</p>

                <div className="mt-1 flex items-center gap-1 text-sm text-yellow-400">
                  <span>★</span>
                  <span>{p.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({p.reviewsCount})</span>
                </div>

                <button
                  onClick={() =>
                    dispatch(
                      addItem({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image: p.image,
                        quantity: 1,
                      })
                    )
                  }
                  className="mt-auto w-full rounded-md bg-red-600 py-2 font-bold tracking-wide hover:bg-red-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
