import Image from "next/image"
import { notFound } from "next/navigation"

// For demo: same data source as BestSellers.
// In production, fetch from API/DB.
const DATA = {
  "gloves-venum-challenger": {
    name: "Venum Challenger 3.0 Boxing Gloves",
    price: 59.99,
    image: "/products/venum-challenger.jpg",
    description:
      "Durable synthetic leather gloves with multi-layer foam for shock absorption. Great for bag work and sparring.",
  },
  "bjj-gi-tatami": {
    name: "Tatami Estilo BJJ Gi",
    price: 129.99,
    image: "/products/tatami-gi.jpg",
    description:
      "Premium pearl weave gi with reinforced stitching. IBJJF legal.",
  },
  "shin-guards-fairtex": {
    name: "Fairtex SP7 Shin Guards",
    price: 89.99,
    image: "/products/fairtex-shin.jpg",
    description:
      "Detachable in-step design with full shin coverage, secure fit, and great protection.",
  },
  "headgear-rdx": {
    name: "RDX Headgear w/ Face Bar",
    price: 74.99,
    image: "/products/rdx-headgear.jpg",
    description:
      "Full-face protection headgear with high-density foam and adjustable closure.",
  },
} as const

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = (DATA as any)[params.id]
  if (!product) return notFound()

  return (
    <main className="bg-white text-black">
      <div className="mx-auto max-w-7xl gap-10 px-6 py-12 lg:grid lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border">
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={900}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold">{product.name}</h1>
          <div className="mt-2 text-2xl font-bold">${product.price.toFixed(2)}</div>
          <p className="mt-6 text-gray-700">{product.description}</p>

          <button className="mt-8 rounded-md bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
            Add to Cart
          </button>

          <div className="mt-10">
            <h2 className="text-xl font-bold">Reviews</h2>
            <p className="mt-2 text-sm text-gray-600">Coming soon…</p>
          </div>
        </div>
      </div>
    </main>
  )
}
