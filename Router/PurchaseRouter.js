const express = require('express')
const stripeService = require('./../Service/stripeService')
const authService = require('./../Service/AuthService')
const purchaseorderService = require('../Service/purchaseOrderService')
const router = express.Router();
router.use(authService.protect)
router.post('/addMoneyToWallet', stripeService.customPaymentService)
router.get('/cards',stripeService.getCards)
router.get('/invoices', purchaseorderService.getInvoices)
module.exports = router