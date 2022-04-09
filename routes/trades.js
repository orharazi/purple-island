var express = require('express');
var router = express.Router();
const Trade = require('../models/trade.model')
const paginatedResults = require('../middleware/pagination')

//GET all trades
router.get('/', paginatedResults(Trade, 'offeredUsername'), async (req,res) => {
  try {
    res.status(200).json(res.paginatedResults)
  } catch (e) {
    res.status(400).json({message: e})
  }
})

//GET one trade by trade id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await Trade.findOne({_id: req.query.id})
    res.status(200).json(user)
  } catch (e) {
    res.status(400).json({message: e})
  }
});

//GET trades by user id
router.get('/', async (req,res) => {
  const {userId} = req.query
  try {
    const tradesByUser = await Trade.find({offeredsUser: userId})
    res.status(200).json(tradesByUser)
  } catch (e) {
    res.status(400).json({message: e})
  }
})

//POST new trade
router.post('/', (req, res) => {
  // add multiparti middleware
  let trade = new Trade({
    offeredUser: req.body.offeredUser,
    offeredUsername: req.body.offeredUsername,
    offeredItems: req.body.offeredItems,
    active: true
  })

  trade.save()
  .then(response => {
    res.status(200).json({
      message: "Trade Added Successfully!"
    })
  })
  .catch(err => {
    res.status(400).json({
      message: err
    })
  })
})

//PUT an existing trade
router.put('/:id', async (req, res) => {
  try {
    let trade = await Trade.findOne({_id: req.query.id})
    if (req.body.acceptedBid) {
      trade.acceptedBid = req.body.acceptedBid
      trade.active = false
    } 
    if (req.body.active) {
      trade.active = false
    }
    trade.save()
    .then(response => {
      res.status(200).json({
        message: "Trade Updated Successfully!"
      })
    })
    .catch(err => {
      res.status(400).json({
        message: err
      })
    })
  } catch (e) {
    res.status(400).json({message: e})
  }
})

module.exports = router;
