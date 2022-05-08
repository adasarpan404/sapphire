const mongoose = require('mongoose')
const PurchaseOrderSchema = new mongoose.Schema({
        totalAmount: {
            type: Number,
            required: true
        },
        product: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.ObjectId,
            required: [true, 'Purchase order must have an user']
        },
        type: {
            type: String,
        },
        receipt: {type: String},
        invoice_url: {type: String}, 
        invoice_pdf: {type: String},
        invoice_no: {type: String},
        bill_to: {type: String}

    
},{
        timestamps: true
    }
)
const PurchaseOrderModel = mongoose.model('purchaseorder', PurchaseOrderSchema)
module.exports = PurchaseOrderModel



