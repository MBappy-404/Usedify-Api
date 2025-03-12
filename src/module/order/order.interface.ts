import { Document, Types } from 'mongoose'

export interface IOrder extends Document {
  buyer: Types.ObjectId
  seller: Types.ObjectId
  products: {
    product: Types.ObjectId
  }[]
  totalPrice: number
  status: 'Pending' | 'Paid'  | 'Failed' | 'Cancel'
  transaction: {
    id: string
    transactionStatus: string
    bank_status: string
    sp_code: string
    sp_message: string
    method: string
    date_time: string
  }
  createdAt?: Date
  updatedAt?: Date
}
