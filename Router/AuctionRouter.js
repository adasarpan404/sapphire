const express = require('express');
const AuctionService = require('../Service/AuctionService')
const authService = require('./../Service/AuthService')

const router = express.Router();

router.use(authService.protect);

router.post('/createBid', AuctionService.createBid);

router.get('/AllBid', AuctionService.getAllBid);

router.get('/MyBid', AuctionService.getMyBid)

router.get('/ArtBid/:id', AuctionService.getAllArtBid)

router.get('/particular/:id', AuctionService.getArtBidById)

module.exports = router;