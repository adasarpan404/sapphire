const express = require('express')
const authService = require('./../Service/AuthService')
const favouritesService = require('./../Service/FavourtiesService')

const router = express.Router();
router.use(authService.protect)

router.post('/createFavourites',favouritesService.createFavourites);
router.get('/myFavourites', favouritesService.getAllFavourites);
router.get('/artFavourites/:id', favouritesService.getAllArtFavourites);
module.exports = router