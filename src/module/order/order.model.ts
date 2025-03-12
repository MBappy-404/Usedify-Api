import { model, Schema } from 'mongoose'

// order model
const orderSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price must be a positive value.'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid','Failed','Cancel'],
      default: 'Pending', // Default status for new orders
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  { timestamps: true }
)

const Order = model('Order', orderSchema)

export default Order
