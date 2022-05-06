const AppError = require('../Utils/AppError')

const catchAsync = require('../Utils/CatchAsync')

const nftCollection = require('../Model/NftCollectionModel')
const TradingModel = require('../Model/TradingModel')

const factory = require('./HandleFactory')

const APIFeatures = require('./../Utils/ApiFeatures')

exports.createTrade = catchAsync(async(req, res, next)=> {
    const trade = await TradingModel.create({
        artId: req.body.artId,
        seller: req.user._id,
        buyer: req.body.buyer,
        transaction: req.body.transaction
    })
    const nft = await nftCollection.findByIdAndUpdate(req.body.artId, {current_Owner: req.body.buyer}, {
        
            new: true,
            runValidators: true
        
    })

    res.status(200).json({
        status: 'success',
        data: trade,
        nft
    })
})

exports.getAllTrade = catchAsync(async(req, res, next)=>{
    console.log(req.user._id)
    const trade = await TradingModel.find().or([{ buyer: req.user._id }, { seller: req.user._id }]);
    console.log(trade)
    res.status(200).json({
        status: 'success',
        data: trade
    })
})



