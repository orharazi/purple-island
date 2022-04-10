var express = require('express');
var router = express.Router();
const Bid = require('../models/bid.model')

//GET bids by bidding user or by trade id
router.get('/', async (req,res) => {
  const {tradeId} = req.query
  try {
    if (tradeId) {
      const userBid = await Bid.find({tradeId: tradeId})
      res.status(200).json(userBid)
    } else {
      const userBid = await Bid.find()
      res.status(200).json(userBid)
    }
  } catch (e) {
    res.status(400).json({message: e})
  }
})

//GET one bid
router.get('/:id', async (req, res, next) => {
  const bid = await Bid.findOne({_id: req.params.id})
  res.status(200).json(bid)
});

//POST new bid
router.post('/', async (req, res) => {
  let bid = new Bid({
    tradeId: req.body.tradeId,
    biddingUser: req.body.biddingUser,
    biddingUsername: req.body.biddingUsername,
    offeredItems: req.body.offeredItems
  })

  bid.save()
  .then(response => {
    res.status(200).json({
      message: "Bid Added Successfully!"
    })
  })
  .catch(err => {
    res.status(400).json({
      message: err
    })
  })
})

module.exports = router;
