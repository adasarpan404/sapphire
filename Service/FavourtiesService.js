const catchAsync = require('../Utils/CatchAsync')
const AppError= require('../Utils/AppError')
const FavouritesModel = require('../Model/FavouritesModel')
const factory = require('./HandleFactory')

exports.createFavourites = catchAsync(async(req, res, next)=>{
    const newFavourites = await FavouritesModel.create({
        artId: req.body.artId,
        user: req.user._id
    })
    res.status(200).json({
        status: 'success',
        data: newFavourites
    })
})


exports.getAllFavourites = catchAsync(async(req, res, next)=>{
    const favourites = await FavouritesModel.find({user: req.user._id});
    res.status(200).json({
        status: 'success',
        data: favourites
    })
})

exports.getAllArtFavourites = catchAsync(async(req, res, next)=>{
    const favourites = await FavouritesModel.find({artId: req.params.id});
    res.status(200).json({
        status: 'success',
        data: favourites
    })
})
