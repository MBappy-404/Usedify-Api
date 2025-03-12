import { Request, Response } from 'express'
import { OrderService } from './order.service'

import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import AppError from '../../errors/AppError'

const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.createOrder(req.body, req.ip!)

    // Send success response
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Order created successfully.',
      data: result,
    })
  } catch (error: any) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: error,
      stack: error.stack,
    })
  }
}

const purchasesHistory = catchAsync(async (req, res) => {
  const userId  = req.params.userId 
  const result = await OrderService.purchasesHistory(userId )
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'purchasesHistory  retrieved successfully.',
    data: result,
  })
})
const salesHistory = catchAsync(async (req, res) => {
  const userId  = req.params.userId 
  const result = await OrderService.salesHistory(userId )
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'salesHistory  retrieved successfully.',
    data: result,
  })
})
const getOrdersById = catchAsync(async (req, res) => {
  const id = req.params.id

  const result = await OrderService.getOrdersById(id)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order list retrieved successfully.',
    data: result,
  })
})
const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrders()
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order list retrieved successfully.',
    data: result,
  })
})

const calculateRevenue = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.calculateRevenueOrders()

    res.status(200).json({
      success: true,
      message: 'Revenue calculated successfully',
      data: result[0],
    })
  } catch (error: any) {
    // Handle errors
    res.status(404).json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: error,
      stack: error.stack,
    })
  }
}

const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderService.verifyPayment(req.query.order_id as string)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Payment info retrieved successfully.',
    data: order,
  })
})

export const OrderController = {
  createOrder,
  purchasesHistory,
  salesHistory,
  getOrdersById,
  getAllOrders,
  calculateRevenue,
  verifyPayment,
}
