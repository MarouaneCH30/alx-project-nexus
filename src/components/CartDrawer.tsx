"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Trash2, Minus, Plus } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  selectCartLines,
  selectCartSubtotal,
  selectCartCount,
  addItem,
  decrementItem,
  setQuantity,
  removeItem,
  clearCart,
} from "@/store/cartSlice"

type CartDrawerProps = {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const dispatch = useDispatch()
  const lines = useSelector((s: RootState) => selectCartLines(s))
  const count = useSelector((s: RootState) => selectCartCount(s))
  const subtotal = useSelector((s: RootState) => selectCartSubtotal(s))

  // Render client-only values after mount to avoid SSR/CSR mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const hasItems = lines.length > 0

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md transform bg-black text-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold">
            Your Cart {mounted && count > 0 ? `(${count})` : ""}
          </h2>
          <button
            aria-label="Close cart"
            onClick={onClose}
            className="rounded p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex h-[calc(100%-64px)] flex-col">
          {
            // SSR-safe placeholder until mounted (keeps DOM stable)
            !mounted ? (
              <div className="flex-1 px-5 py-4" />
            ) : !hasItems ? (
              // Empty state
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-white">
                  🛒
                </div>
                <p className="text-base font-medium">Your cart is empty</p>
                <p className="text-sm text-white/70">
                  Add some gloves, gis, or headgear to get started.
                </p>
                <a
                  href="/shop"
                  className="mt-3 rounded-md bg-red-600 px-5 py-2 text-sm font-semibold hover:bg-red-700"
                  onClick={onClose}
                >
                  Start shopping
                </a>
              </div>
            ) : (
              <>
                {/* Lines */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-4">
                    {lines.map((line) => (
                      <li
                        key={line.id}
                        className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <div className="relative h-20 w-20 overflow-hidden rounded-md border border-white/10 bg-black/40">
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized={line.image.startsWith("http")}
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {line.name}
                              </p>
                              <p className="mt-1 text-sm text-white/70">
                                ${line.price.toFixed(2)}
                              </p>
                            </div>

                            <button
                              aria-label="Remove item"
                              className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
                              onClick={() => dispatch(removeItem(line.id))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Quantity controls */}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-md border border-white/15 bg-white/5">
                              <button
                                className="grid h-8 w-8 place-items-center text-white/80 hover:bg-white/10"
                                onClick={() => dispatch(decrementItem(line.id))}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                className="h-8 w-10 bg-transparent text-center text-sm outline-none"
                                value={line.quantity}
                                onChange={(e) =>
                                  dispatch(
                                    setQuantity({
                                      id: line.id,
                                      quantity: Number(e.target.value) || 1,
                                    })
                                  )
                                }
                                inputMode="numeric"
                                aria-label="Quantity"
                              />
                              <button
                                className="grid h-8 w-8 place-items-center text-white/80 hover:bg-white/10"
                                onClick={() =>
                                  dispatch(addItem({ ...line, quantity: 1 })) // increment
                                }
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="text-sm font-semibold">
                              ${(line.price * line.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-white/70">Subtotal</span>
                    <span className="text-base font-semibold">
                      {mounted ? `$${subtotal.toFixed(2)}` : "$0.00"}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <button
                      onClick={() => dispatch(clearCart())}
                      className="text-xs text-white/60 underline-offset-2 hover:text-white hover:underline"
                    >
                      Clear cart
                    </button>
                    <span className="text-xs text-white/50">
                      Shipping & taxes calculated at checkout
                    </span>
                  </div>

                  <button
                    className="w-full rounded-md bg-red-600 px-5 py-3 text-sm font-semibold hover:bg-red-700"
                    onClick={() => alert("Checkout flow coming soon")}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )
          }
        </div>
      </aside>
    </>
  )
}
