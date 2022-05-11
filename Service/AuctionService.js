const catchAsync = require('../Utils/CatchAsync')
const UserModel = require('../Model/userModel')
const AuctionModel = require('../Model/AuctionModel')
const factory = require('./HandleFactory')
const AppError = require('../Utils/AppError')
exports.createBid = catchAsync(async(req, res, next)=> {
    if((req.user.wallet-req.body.biddingAmount)<0){
        return next(new AppError('You do not have enough balance to bid', 401))
    }
    
    const newBid = await AuctionModel.create({
        artId: req.body.artId,
        user: req.user._id,
        biddingAmount: req.body.biddingAmount
    })
    const amount_Deducted = req.user.wallet - req.body.biddingAmount;
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        wallet: amount_Deducted
    })
    res.status(201).json({
        status: 'success',
        data: {newBid, user}
    })
})

exports.getAllBid = catchAsync(async(req, res, next)=>{
    const bid = await AuctionModel.find();
    res.status(200).json({
        status: 'success',
        data: bid
    })
})

exports.getAllArtBid = catchAsync(async(req, res, next)=>{
    const bid = await AuctionModel.find({artId: req.params.id});
    res.status(200).json({
        status: 'success',
        data: bid
    })
})

exports.getMyBid = catchAsync(async(req, res, next)=>{
    const bid = await AuctionModel.find({user: req.user._id});
    res.status(200).json({
        status: 'success',
        data: bid
    })
})

exports.getArtBidById = factory.getOne(AuctionModel)