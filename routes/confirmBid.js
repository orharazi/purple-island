var express = require('express');
var router = express.Router();
const Trade = require('../models/trade.model')
const User = require('../models/user.model')
const Bid = require('../models/bid.model')

const checkIfUserHaveItems = (itemsToCheck, userItems) => {
  let userHaveItems = true
  itemsToCheck.forEach(item => {
    const userItem = userItems.find(i => i.itemID.toString() === item.itemID)
    if (!userItem) {
      userHaveItems = false
    } else {
      if (userItem.Amount < item.Amount) {
        userHaveItems = false
      }
    }
  })
  return userHaveItems
}

const changeUserItems = (removeItems, addItems, userItems) => {
  removeItems.forEach(item => {
    const userItem = userItems.find(i => i.itemID.toString() === item.itemID)
    userItem.Amount -= item.Amount
    if (userItem.Amount === 0) {
      userItems.splice(userItems.indexOf(userItem), 1)
    }
  })
  addItems.forEach(item => {
    const userItem = userItems.find(i => i.itemID.toString() === item.itemID)
    if (userItem) {
      userItem.Amount += item.Amount
    } else {
      userItems.push(
        {
        itemID: item.itemID,
        Amount: item.Amount
      })
    }
  })
}

//POST new trade
router.post('/', async (req, res) => {
  const {tradeData} = req.body
  const openTradeUser = await User.findById(tradeData.openTradeUser.id)
  const createBidUser = await User.findById(tradeData.createBidUser.id)
  const currentTrade = await Trade.findById(tradeData.tradeId)
  const currentBid = await Bid.findById(tradeData.bidId)

  if (openTradeUser, createBidUser, currentTrade, currentBid) {
    const openTradeUserHaveItems = checkIfUserHaveItems(tradeData.openTradeUser.itemsToTrade, openTradeUser.OwnedItems)
    const createBidUserHaveItems = checkIfUserHaveItems(tradeData.createBidUser.itemsToTrade, createBidUser.OwnedItems)
    if (openTradeUserHaveItems && createBidUserHaveItems) {
      changeUserItems(tradeData.createBidUser.itemsToTrade, tradeData.openTradeUser.itemsToTrade, createBidUser.OwnedItems)
      changeUserItems(tradeData.openTradeUser.itemsToTrade, tradeData.createBidUser.itemsToTrade, openTradeUser.OwnedItems)
      currentTrade.active = false
      currentTrade.save()
      openTradeUser.save()
      createBidUser.save()
      res.status(200).json({messege: 'Trade Done!'})
    } else {
      if (!openTradeUserHaveItems) {
        // trade status = false
        currentTrade.active = false
        currentTrade.save()
        res.status(400).json({messege: 'openTradeUser dont have all items!'})
      }
      if (!createBidUserHaveItems) {
        // delete bid
        currentBid.remove().exec()
        res.status(400).json({messege: 'createBidUser dont have all items!'})
      }
    }
  } else {
    // request error!
    res.status(400).json({messege: 'could not find Users, Trade or bid!'})
  }
})

module.exports = router;
