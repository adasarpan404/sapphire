const mongoose = require('mongoose')
const UserModel = require('./userModel')

const nftCollectionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please tell us the name of collection']
    },
    current_Owner:{
        type: mongoose.Schema.ObjectId,
        required: [true, 'Art work has its owner'],
        ref: 'User'
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Art has its creator'],
        ref: 'User'
    },
    currentPrice: {
        type: Number, 
        required: [true, 'Art must have price']
    },
    startingPrice: {
        type: Number,
        required: [true, 'Art must have an opening price']
    },
    imageUrl: {
        type: String,
        required: [true, "Art must have an image"]
    },
    wish: {
        type: String, 
        enum: ["Sell", "Show", "Private"],
        default: "Sell"
    },
    liked: {
        type: Number,
        default: 0
    }
})

nftCollectionSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'current_Owner',
        select: 'name phonenumber'
    }).populate({
        path: 'creator',
        select: 'name phonenumber'
    })
    next();
})


nftCollectionSchema.statics.calcWealthForUser= async function(userId){
    const stats = await this.aggregate([
        {
            $match: {current_Owner: userId}
        },{
            $group: {
                _id: '$current_Owner',
                total: {$sum: "$currentPrice"}
            }
        }
    ])

    if(stats.length > 0){
        await UserModel.findByIdAndUpdate(userId, {
            collectionWorth: stats[0].total
        })
    }
}
nftCollectionSchema.post('save', function(){
    this.constructor.calcWealthForUser(this.current_Owner);
})

nftCollectionSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

nftCollectionSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcWealthForUser(this.r.current_Owner);
});
const nftCollection= mongoose.model('NFTCollection', nftCollectionSchema)

module.exports = nftCollection;