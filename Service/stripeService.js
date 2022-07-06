const Stripe = require('stripe')
const catchAsync = require('../Utils/CatchAsync')
const stripe = new Stripe(process.env.Stripe_Secret_Key)
const PurchaseOrderModel = require('../Model/PurchaseOrderModel')
const UserModel = require('../Model/userModel')
var _ = require('lodash');
// const orders = stripe.orders
const customers = stripe.customers
// const paymentMethods = stripe.paymentMethods
// const paymentIntents = stripe.paymentIntents
// const subscriptions = stripe.subscriptions
const taxAPI = stripe.taxRates

const tokens = stripe.tokens

exports.customPaymentService = catchAsync(async(req, res, next)=>{
    const {source, amount, amountWithOutTax, card} = req.body;
    const {email, name, _id, wallet} = req.user.toObject();
    let tax_rates = []
    // let tax_rates_percentage = []
    // let default_source = card
    return customers
        .list({ email })
        .then((response) => _.find(response.data, { email }))
        .then((customer) => {
            console.log(customer)
            if (customer) {
                return { customer, isNew: false }
            }
            
            return customers.create({ source, email, name }).then((customer) => ({ customer, isNew: true }))
        })
        .then(async ({ customer, isNew }) => {
            return customer
        }).then(async (customer) => {
            if (customer.id) {
                const taxRateResponse = await taxAPI.list({ active: true })
                // const taxRateResponse = await taxAPI.list()
                const taxRateList = taxRateResponse.data
                console.log(taxRateList)
                if (taxRateList.length > 0) {
                    tax_rates = taxRateList.map((tax) => tax.id)
                }

                const invoiceItem = await stripe.invoiceItems.create({
                    customer: customer.id,
                    currency: 'inr',
                    tax_rates,
                    description: `You added ${amountWithOutTax} into wallet`,
                    quantity: amountWithOutTax*100,
                    unit_amount_decimal: 1
                })
                const invoice = await stripe.invoices.create({
                    customer: invoiceItem.customer,
                    description: `You added ${amountWithOutTax} into wallet`,
                })
                const invoicePaid = await stripe.invoices.pay(invoice.id)
                let amount_to_be_added = wallet + amount
                console.log(invoicePaid)
                await PurchaseOrderModel.create({
                    totalAmount: invoicePaid.subtotal,
                    product: `You added ${amountWithOutTax} into wallet`,
                    user: _id,
                    type: 'STRIPE',
                    // receipt: charge.receipt_url,
                    invoice_url: invoicePaid.hosted_invoice_url,
                    invoice_pdf: invoicePaid.invoice_pdf,
                    invoice_no: invoicePaid.number,
                    bill_to: invoicePaid.customer_email,
                })
                await UserModel.findByIdAndUpdate(
                    _id,
                    { wallet: amount_to_be_added} , {
        
                        new: true,
                        runValidators: true
                    
                }
                ).then((user) => {
                    res.status(200).json({
                        status: 'success',
                        user,
                        message: `${amount} added to your wallet`
                    })
                })
            } else {
                res.status(400).json(
                    {
                        status: 'fail',
                        message: 'Payment not completed'
                    }
                )
            }
        })
        .catch((e) => {
            console.log(e)
            res.status(e.statusCode || 400).json({
                status: 'fail',
                message: 'payment failed'
        })
        })


})

exports.getCards = catchAsync(async(req, res, next)=> {
    try {
        let user = await UserModel.findById(req.user._id).lean()
        customers
            .list({ email: user.email })
            .then(({ data }) => {
                console.log(JSON.stringify(data, null, 2))
                if (data.length == 0) return { data: [] }
                return customers.listSources(data[0].id, { object: 'card' })
            })
            .then((cards) => {
                res.status(200).json({
                    status:"success",
                    data:cards.data,
                    
                })
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json(
                {
                    status:"fail",
                    message:"no cards is saved"
                    }
                )
            })
    } catch (err) {
        console.log(err)
        res.status(500).json(
            {
                status:"fail",
                message:err
            })
    }

})