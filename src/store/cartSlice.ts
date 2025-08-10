// src/store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type CartLine = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type CartState = { lines: CartLine[] }

const initialState: CartState = { lines: [] }

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartLine>) => {
      const existing = state.lines.find(l => l.id === action.payload.id)
      if (existing) existing.quantity += action.payload.quantity
      else state.lines.push(action.payload)
    },
    decrementItem: (state, action: PayloadAction<string>) => {
      const line = state.lines.find(l => l.id === action.payload)
      if (line) line.quantity = Math.max(1, line.quantity - 1)
    },
    setQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const line = state.lines.find(l => l.id === action.payload.id)
      if (line) line.quantity = Math.max(1, Math.floor(action.payload.quantity || 1))
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.lines = state.lines.filter(l => l.id !== action.payload)
    },
    clearCart: (state) => {
      state.lines = []
    },

    // 👇 NEW: client-side hydration from localStorage
    hydrateCart: (state, action: PayloadAction<CartState | undefined>) => {
      if (action.payload?.lines) {
        state.lines = action.payload.lines
      }
    },
  },
})

export const {
  addItem, decrementItem, setQuantity, removeItem, clearCart, hydrateCart,
} = cartSlice.actions

export const addToCart = addItem
export default cartSlice.reducer

// selectors
type Root = { cart: CartState }
export const selectCartLines = (s: Root) => s.cart.lines
export const selectCartCount = (s: Root) => s.cart.lines.reduce((n, l) => n + l.quantity, 0)
export const selectCartSubtotal = (s: Root) => s.cart.lines.reduce((n, l) => n + l.price * l.quantity, 0)
