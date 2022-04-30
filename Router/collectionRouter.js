
const express = require('express')


const NftCollectionService = require('./../Service/NftCollectionService')
const AuthService =require('./../Service/AuthService')

const router = express.Router();

router.post('/createCollection',AuthService.protect, NftCollectionService.uploadImages, NftCollectionService.createCollection)
router.get('/:id', NftCollectionService.getCollectionById)
router.get('/getCollection', NftCollectionService.getAllCollection);

module.exports = router;