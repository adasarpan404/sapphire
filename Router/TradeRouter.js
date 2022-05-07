const express = require('express')
const authService = require('./../Service/AuthService')
const tradeService = require('./../Service/TradingService')
const router = express.Router();
router.use(authService.protect)
router.post('/createTrade', tradeService.createTrade);
router.get('/', tradeService.getAllTrade)
router.get('/artTrade/:id', tradeService.getAllArtTrade);

module.exports = router;