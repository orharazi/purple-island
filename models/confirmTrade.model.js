const mongoose = require("mongoose")
const { Schema } = mongoose;

const confirmTradeSchema = new Schema({
  bidedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bidedItems: [{
    itemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    Amount: Number
  }],
  tradedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tradedItems: [{
    itemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    Amount: Number
  }]
 
}, {timestamps: true})

module.exports = mongoose.model('confirmTrade', confirmTradeSchema);