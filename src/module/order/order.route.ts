import express from 'express'
import { OrderController } from './order.controller'

const router = express.Router()


router.get('/verify', OrderController.verifyPayment)
router.post('/', OrderController.createOrder)
// router.get('/', OrderController.getAllOrders)
router.get('/purchases/:userId', OrderController.purchasesHistory)
router.get('/sales/:userId', OrderController.salesHistory)
router.get('/:id', OrderController.getOrdersById)
router.get('/revenue', OrderController.calculateRevenue)


export const orderRoutes  = router;
