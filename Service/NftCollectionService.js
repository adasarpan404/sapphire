const AppError = require('../Utils/AppError');
const catchAsync =require('../Utils/CatchAsync');

const nftCollection = require('../Model/NftCollectionModel')
const uploadFile = require('../Utils/S3')

const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)


const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const APIFeatures = require('./../Utils/ApiFeatures');
const factory = require('./HandleFactory')
exports.uploadImages = upload.single('image');

exports.createCollection = catchAsync(async(req, res, next)=>{
  req.file.filename = `image-${req.user._id}-${Date.now()}`
    const data = await uploadFile.uploadFile(req.file, 'collection')
    await unlinkAsync(req.file.path)
    console.log(data)
    const newCollection = await nftCollection.create({
      name: req.body.name,
      current_Owner: req.user._id,
      creator: req.user._id,
      startingPrice: req.body.startingPrice,
      currentPrice: req.body.startingPrice,
      imageUrl: req.file.filename
    }
    )

    res.status(200).json({
      status: 'success',
      data: newCollection
    })
})



exports.getAllCollection =  catchAsync(async (req, res, next)=> {
  console.log("hii")
  const doc = await nftCollection.find();
  
  res.status(200).json({
    status: 'success',
    data: doc
  })
})

exports.getAllUserCollection = catchAsync(async (req, res, next)=>{
  const doc = await nftCollection.find({current_Owner: req.user._id});
  res.status(200).json({
    status: "success",
    data: doc
  })
})
exports.getCollectionById = factory.getOne(nftCollection)

exports.changeVisibility = catchAsync(async(req, res, next)=>{
  const art = await nftCollection.findById(req.params.id)
  if(!art){
    return next(new AppError('This Id is not associated with any art', 401))
  }
  if(String(art.current_Owner._id) !== String(req.user._id)){
    return next(new AppError('This Art does not belong to you', 401))
  }
  const changedWish = await nftCollection.findByIdAndUpdate(req.params.id, {
    wish: req.body.wish
  })
  res.status(200).json({
    status: 'success',
    data: changedWish
  })
})