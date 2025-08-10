import { configureStore } from "@reduxjs/toolkit"
import cart from "./cartSlice"

const PERSIST_KEY = "mas_cart_v1"

// Load cart state from localStorage
function loadState() {
  if (typeof window === "undefined") return undefined
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    return raw ? { cart: JSON.parse(raw) } : undefined
  } catch {
    return undefined
  }
}

export const store = configureStore({
  reducer: { cart },
  preloadedState: loadState(),
})

// Save cart state to localStorage when it changes
store.subscribe(() => {
  try {
    const state = store.getState()
    localStorage.setItem(PERSIST_KEY, JSON.stringify(state.cart))
  } catch {}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
