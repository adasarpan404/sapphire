const AppError = require('../Utils/AppError')

const catchAsync = require('../Utils/CatchAsync')

const nftCollection = require('../Model/NftCollectionModel')
const TradingModel = require('../Model/TradingModel')
const AuctionModel = require('../Model/AuctionModel')
const factory = require('./HandleFactory')

const APIFeatures = require('./../Utils/ApiFeatures')

exports.createTrade = catchAsync(async(req, res, next)=> {

    
    const Bid_confirmed = await AuctionModel.findById(req.body.bid)
    console.log(Bid_confirmed)
    const trade = await TradingModel.create({
        artId: Bid_confirmed.artId._id,
        seller: req.user._id,
        buyer: Bid_confirmed.user,
        transaction: Bid_confirmed.biddingAmount
    })
    const nft = await nftCollection.findByIdAndUpdate(Bid_confirmed.artId, {current_Owner: Bid_confirmed.user, wish: 'Private', currentPrice: Bid_confirmed.biddingAmount}, {
        
            new: true,
            runValidators: true
        
    })
    
    const Bid=await AuctionModel.deleteMany({artId: Bid_confirmed.artId})
    res.status(200).json({
        status: 'success',
        data: trade,
        nft
    })
})

exports.getAllTrade = catchAsync(async(req, res, next)=>{
    const trade = await TradingModel.find().or([{ buyer: req.user._id }, { seller: req.user._id }]);
    res.status(200).json({
        status: 'success',
        data: trade
    })
})

exports.getAllArtTrade = catchAsync(async(req, res, next)=>{
    console.log(req.user.id)
    const trade = await TradingModel.find({artId: req.params.id});
    res.status(200).json({
        status: 'success',
        data: trade
    })
})

