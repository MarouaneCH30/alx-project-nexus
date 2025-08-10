export type Product = {
  id: string
  slug: string
  name: string
  brand: string 
  category: "striking" | "grappling" | "protection" |     "apparel" | "equipment"
  price: number
  image: string
  rating: number // 0..5 (allow halves)
  reviewsCount: number
  isBestSeller?: boolean
   isNewArrival?: boolean
}
