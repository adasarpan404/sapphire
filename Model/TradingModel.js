const mongoose = require('mongoose')
const TradingModelSchema = new mongoose.Schema({
    artId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Transaction must have an Art '],
        ref: 'NFTCollection'
    },
    transaction:{
        type: Number,
        required: [true, 'Transaction must have a price']
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Transaction must have a seller'],
        ref: 'User'
    },
    buyer: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Transaction must have a buyer'],
        ref: 'User'
    },
    CreatedOn: {
        type: Date,
        default: Date.now()
    }
})


TradingModelSchema.pre(/^find/, function(next){
    this.populate({
        path: "artId",
        select: "current_Owner currentPrice name imageUrl"
    }).populate({
        path: "seller",
        select: 'name phonenumber'
    }).populate({
        path: "buyer",
        select: "name phonenumber"
        
    }
    )
    next();
})

const TradingCollection = mongoose.model('Trade', TradingModelSchema);
module.exports = TradingCollection;