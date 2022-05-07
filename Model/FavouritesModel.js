const mongoose = require('mongoose')
const nftCollection = require('./NftCollectionModel')
const FavouritesSchema = new mongoose.Schema({
    artId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Favourites must have an art'],
        ref: 'NFTCollection'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Favourites must have an user'],
        ref: 'User'
    },
    CreatedOn: {
        type: Date,
        default: Date.now()
    }

})
FavouritesSchema.index({ artId: 1, user: 1 }, { unique: true });

FavouritesSchema.pre(/^find/, function(next){
    this.populate({
        path: "artId",
        select: "name current_Owner imageUrl"
    }).populate({
        path: "user",
        select: "name phonenumber"
    })
    next();
})

FavouritesSchema.statics.calcNoOfLikes = async function(art){
    const stats = await this.aggregate([
        {
            $match: {artId: art}
        },{
            $group:{
                _id: '$artId',
                total: {$sum: 1}
            }
        }
    ])
    if(stats.length > 0){
        await nftCollection.findByIdAndUpdate(art, {
            liked: stats[0].total
        })
    }
}

FavouritesSchema.post('save', function(){
    this.constructor.calcNoOfLikes(this.artId);
})
FavouritesSchema.pre(/^findOneAnd/, async function (next){
    this.r = await this.findOne();
    next();
})


FavouritesSchema.post(/^findOneAnd/, async function(next){
    await this.r.constructor.calcNoOfLikes(this.r.artId);
})
const FavouritesCollection = mongoose.model('Favourites', FavouritesSchema)
module.exports = FavouritesCollection