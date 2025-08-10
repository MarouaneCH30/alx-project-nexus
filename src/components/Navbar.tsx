"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { selectCartCount } from "@/store/cartSlice"
import CategoriesMegaMenu from "@/components/CategoriesMegaMenu"
import CartDrawer from "@/components/CartDrawer"
import SearchDrawer from "@/components/SearchDrawer"

const LINKS = [
  { label: "SHOP", href: "/shop" },
  
]

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // 👇 avoid SSR mismatch by rendering badge only after mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const cartCount = useSelector((state: RootState) => selectCartCount(state))

  return (
    <>
      <header className="sticky top-0 z-50 bg-black text-white">
        <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center px-4">
          {/* LEFT: logo */}
          <Link href="/" className="flex items-center">
            <div className="grid h-16 w-16 place-items-center rounded-full">
              <Image src="/logo.png" alt="logo" width={48} height={48} priority />
            </div>
            <span className="sr-only">Home</span>
          </Link>

          {/* CENTER: nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center justify-center gap-10">
              <li><CategoriesMegaMenu /></li>
              {LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold tracking-wide transition hover:text-red-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT: icons */}
          <div className="flex items-center gap-5 justify-self-end">
            <button
              aria-label="Search"
              className="transition hover:text-red-500"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart + badge */}
            <div className="relative">
              <button
                aria-label="Cart"
                className="transition hover:text-red-500"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
              </button>

              {/* Render badge only after mount to avoid hydration mismatch */}
              {mounted && cartCount > 0 && (
                <span
                  className="absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white shadow"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Drawers outside header */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
