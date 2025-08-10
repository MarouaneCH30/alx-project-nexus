"use client"

import { Provider } from "react-redux"
import { useEffect } from "react"
import { store } from "@/store/store"           // ✅ your store lives in src/store
import { hydrateCart } from "@/store/cartSlice" // ✅ new action we added

const PERSIST_KEY = "mas_cart_v1"

export default function Providers({ children }: { children: React.ReactNode }) {
  // Hydrate the cart on the CLIENT after mount so you see items immediately
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PERSIST_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw)
      // We might have saved either {lines: [...] } or {cart: {lines: [...]}}
      const cartState = parsed?.lines ? parsed : parsed?.cart
      if (cartState?.lines) {
        store.dispatch(hydrateCart(cartState))
      }
    } catch {
      // ignore
    }
  }, [])

  return <Provider store={store}>{children}</Provider>
}
