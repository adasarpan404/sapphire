const mongoose = require('mongoose')
const NftCollectionModel = require('./NftCollectionModel')
const auctionSchema = new mongoose.Schema({
    artId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Auction has an art'],
        ref: 'NFTCollection'
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

auctionSchema.statics.createPriceForNftCollection = async function(art){
    const stats = await this.aggregate([
        {
            $match: {artId: art}
        },{
            $group:{
                _id: '$artId',
                price: {$max: "$biddingAmount"}
            }
        }
    ])

    if(stats.length> 0){
        await NftCollectionModel.findByIdAndUpdate(art, {
            currentPrice: stats[0].price
        })
    }
}
auctionSchema.index({ artId: 1, user: 1 }, { unique: true });
auctionSchema.post('save', function(){
    this.constructor.createPriceForNftCollection(this.artId)
})

auctionSchema.pre(/^findOneAnd/, async function(next){
    this.r = this.findOne();
})

auctionSchema.post(/^findOneAnd/, async function(){
    await this.r.constructor.calcWealthForUser(this.r.current_Owner);
})

const auctionCollection = mongoose.model('Auction',auctionSchema )

module.exports = auctionCollection;