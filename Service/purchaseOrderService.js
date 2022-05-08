const catchAsync = require('../Utils/CatchAsync')

const PurchaseOrderModel = require('../Model/PurchaseOrderModel')

exports.getInvoices = catchAsync(async(req, res, next)=>{
    const invoice = await PurchaseOrderModel.find({user: req.user._id});
    res.status(200).json({
        status: 'success',
        data: invoice
    })
})