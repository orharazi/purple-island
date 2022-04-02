const mongoose = require("mongoose")
const { Schema } = mongoose;

const tradeSchema = new Schema({
  offeredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offeredUsername: {
    type: String,
    required: true
  },
  offeredItems: [{
    itemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    Amount: Number
  }],
  acceptedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },
  active: {
    type: Boolean,
    required: true
  }
  
}, {timestamps: true})

module.exports = mongoose.model('Trade', tradeSchema);