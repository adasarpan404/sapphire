const mongoose = require('mongoose')

const auctionSchema = new mongoose.Schema({
    artId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Auction has an art'],
        ref: 'NfTCollection'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Auction has its user"],
        ref: 'User'
    },
    biddingAmount: {
        type: Number, 
        required: [true, 'Auction must have an bidding Amount'],
    },
    createdOn: {
        type: Date,
        default: Date.now()
        }
})

auctionSchema.pre(/^find/, function(next){
    this.populate({
        path: "artId", 
        select: "current_Owner currentPrice name imageUrl"
    }).populate({
        path: "user",
        select: "name phonenumber"
    })
    next();
})


const auctionCollection = mongoose.model('Auction',auctionSchema )

module.exports = auctionCollection;