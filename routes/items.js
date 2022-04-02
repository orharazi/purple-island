var express = require('express');
var router = express.Router();
const Item = require('../models/item.model')

//GET all items
router.get('/', async (req,res) => {
  try {
    const items = await Item.find()
    res.status(200).json(items)
  } catch (e) {
    res.status(400).json({message: e})
  }
})

//GET one item
router.get('/:id', async (req, res, next) => {
  const item = await Item.findOne({_id: req.params.id})
  res.status(200).json(item)
});

//POST new item
router.post('/', async (req, res) => {
  let item = new Item({
    name: req.body.name,
    price: req.body.price
  })

  item.save()
  .then(response => {
    res.status(200).json({
      message: "Item Added Successfully!"
    })
  })
  .catch(err => {
    res.status(400).json({
      message: err
    })
  })
  
})

module.exports = router;
