const express = require('express')


const NftCollectionService = require('./../Service/NftCollectionService')
const AuthService =require('./../Service/AuthService')

const router = express.Router();

router.post('/createCollection',AuthService.protect, NftCollectionService.uploadImages, NftCollectionService.createCollection)

module.exports = router;