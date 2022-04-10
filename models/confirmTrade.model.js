const mongoose = require("mongoose")
const { Schema } = mongoose;

const confirmTradeSchema = new Schema({
  bidedUsername: {
    type: String,
    required: true
  },
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
  tradedUsername: {
    type: String,
    required: true
  },
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