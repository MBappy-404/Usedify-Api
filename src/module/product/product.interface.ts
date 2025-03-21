import { Schema } from 'mongoose'

// product interface
export interface IProduct {
  userId: Schema.Types.ObjectId
  name: string
  condition:
    | 'New'
    | 'Like New'
    | 'Good'
    | 'Well Used'
    | 'For Parts or Repair'
  image: string
  price: number
  category:
    | 'Electronics'
    | 'Furniture'
    | 'Fashion'
    | 'Books & Stationery'
    | 'Toys & Games'
    | 'Home Decor'
    | 'Sports Equipment'
    | 'Tools & Equipment'
    | 'Musical Instruments'
    | 'Health & Fitness'
    | 'Collectibles & Art'
    | 'Uncategorized'
  location: string
  description: string
  // quantity: number
  inStock: boolean
}
