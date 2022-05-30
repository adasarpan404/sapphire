const {Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL} = require("@solana/web3.js");
const catchAsync = require('../Utils/CatchAsync')
const {sendAndConfirmTransaction, clusterApiUrl, Connection} = require("@solana/web3.js");
const axios = require('axios')
let fromKeypair = Keypair.generate();
let toKeypair = Keypair.generate();
let transaction = new Transaction();
let keypair = Keypair.generate();
let connection = new Connection(clusterApiUrl('devnet'));






// exports.createTransaction = catchAsync( async(req, res, next)=> {
// const transfer = await transaction.add(
//   SystemProgram.transfer({
//     fromPubkey: fromKeypair.publicKey,
//     toPubkey: toKeypair.publicKey,
//     lamports: LAMPORTS_PER_SOL
//   })
// );

// sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [keypair]
//   );
// res.status(200).json({
//     status: 'success',
//     data: transfer
// })
// })

exports.getStats = catchAsync(async (req, res ,next)=>{
  const stats = await fetch("https://api.blockchair.com/stats")
  console.log(stats)
  res.status(200).json({
    status: "success",
    data: stats
  })
})
