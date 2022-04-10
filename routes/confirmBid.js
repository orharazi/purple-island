var express = require('express');
var router = express.Router();
const ConfirmTrade = require('../models/confirmTrade.model')
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
      let confirmTrade = new ConfirmTrade({
        bidedUser: createBidUser._id,
        bidedUsername: createBidUser.username,
        bidedItems: tradeData.createBidUser.itemsToTrade,
        tradedUser: openTradeUser._id,
        tradedUsername: openTradeUser.username,
        tradedItems: tradeData.openTradeUser.itemsToTrade
      }) 
      confirmTrade.save()
      currentTrade.save()
      openTradeUser.save()
      createBidUser.save()
      res.status(200).json({messege: 'Trade Done!'})
    } else {
      if (!openTradeUserHaveItems) {
        // trade status = false
        currentTrade.active = false
        currentTrade.save()
        res.status(400).json({messege: 'open Trade User dont have all items!'})
      }
      if (!createBidUserHaveItems) {
        // delete bid
        currentBid.remove().exec()
        res.status(400).json({messege: 'create Bid User dont have all items!'})
      }
    }
  } else {
    // request error!
    res.status(400).json({messege: 'could not find Users, Trade or bid!'})
  }
})

//GET deals By UserID
router.get('/:userId', async (req,res) => {
  const userId = req.params.userId
  try {
    if (userId) {
      const userAcceptedTrades = await ConfirmTrade.find({accepted: true, tradedUser: userId})
      const userAcceptedBids = await ConfirmTrade.find({accepted: true, bidedUser: userId})
      const resData = [...userAcceptedTrades, ...userAcceptedBids]
      res.status(200).json(resData)
    }
  } catch (e) {
    res.status(400).json({message: e})
  }
})

module.exports = router;
