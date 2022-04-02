const mongoose = require("mongoose")
const { Schema } = mongoose;

const bidSchema = new Schema({
  tradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade',
    required: true
  },
  offeredsUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offeredItems: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    amount: Number
  }]
 
}, {timestamps: true})

module.exports = mongoose.model('Bid', bidSchema);