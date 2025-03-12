import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { IOrder } from './order.interface'
import Order from './order.model'
import { orderUtils } from './order.utils'

const createOrder = async (payload: IOrder, client_ip: string) => {
  const [buyer, seller] = await Promise.all([
    User.findById(payload.buyer),
    User.findById(payload.seller),
  ])

  if (!buyer) {
    throw new AppError(
      404,
      'Buyer not found',
      'The buyer does not exist in our records'
    )
  }

  if (!seller) {
    throw new AppError(
      404,
      'Seller not found',
      'The seller does not exist in our records'
    )
  }

  const order = await Order.create(payload)

  const shurjopayPayload = {
    amount: payload.totalPrice,
    order_id: order?._id,
    currency: 'BDT',
    customer_name: buyer?.name,
    customer_address: buyer?.address,
    customer_email: buyer?.email,
    customer_phone: buyer?.phone,
    customer_city: 'N/A',
    client_ip,
  }

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload)

  if (payment?.transactionStatus) {
    const updateOrder = await Order.findByIdAndUpdate(
      order?._id,
      {
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      },
      { new: true }
    )
  }

  return payment.checkout_url
}

const purchasesHistory = async (userId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(
      404,
      'User not found',
      'User does not exist in our records'
    )
  }

  const result = await Order.find({ buyer: userId })
    .populate({
      path: 'products.product',
    })
    .populate({
      path: 'seller',
    })

  return result
}
const salesHistory = async (userId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(
      404,
      'User not found',
      'User does not exist in our records'
    )
  }

  const result = await Order.find({ seller: userId })
    .populate({
      path: 'products.product',
    })
    .populate({
      path: 'buyer',
    })

  return result
}

const getOrdersById = async (id: string) => {
  const result = await Order.findById(id).populate({
    path: 'products.product',
  })
  return result
}
const getAllOrders = async () => {
  const result = await Order.find()
    .populate({
      path: 'products.product',
    })
    .populate('user')
  return result
}

// calculate  total revenue
const calculateRevenueOrders = async () => {
  const result = await Order.aggregate([
    {
      $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ])
  return result
}

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id)

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Failed'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      }
    )
  }

  return verifiedPayment
}

export const OrderService = {
  createOrder,
  purchasesHistory,
  salesHistory,
  getOrdersById,
  getAllOrders,
  calculateRevenueOrders,
  verifyPayment,
}
