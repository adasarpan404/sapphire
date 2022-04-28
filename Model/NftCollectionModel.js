const mongoose = require('mongoose')

const nftCollectionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please tell us the name of collection']
    },
    current_Owner:{
        type: mongoose.Schema.ObjectId,
        required: [true, 'Art work has its owner']
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Art has its creator']
    },
    currentPrice: {
        type: String, 
        required: [true, 'Art must have price']
    },
    startingPrice: {
        type: String,
        required: [true, 'Art must have an opening price']
    },
    imageUrl: {
        type: String,
        required: [true, "Art must have an image"]
    }
})


const nftCollection= mongoose.model('NFTCollection', nftCollectionSchema)

module.exports = nftCollection;