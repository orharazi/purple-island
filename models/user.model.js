const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  avatar: {
    type: String,
  },
  OwnedItems: [{
    itemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    Amount: Number
  }]
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);