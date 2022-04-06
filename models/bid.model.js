const mongoose = require("mongoose")
const { Schema } = mongoose;

const bidSchema = new Schema({
  tradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade',
    required: true
  },
  biddingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  biddingUsername: {
    type: String,
    required: true
  },
  offeredItems: [{
    itemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    Amount: Number
  }]
 
}, {timestamps: true})

module.exports = mongoose.model('Bid', bidSchema);