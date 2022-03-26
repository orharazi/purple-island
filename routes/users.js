var express = require('express');
var router = express.Router();
var fs = require('fs')
const User = require('../models/user.model')
const uploadMiddleware = require('../middleware/uplodeFile');
const paginatedResults = require('../middleware/pagination')

//GET all users
router.get('/',paginatedResults(User, "username"), async (req,res) => {
  try {
    res.status(200).json(res.paginatedResults)
  } catch (e) {
    res.status(400).json({message: e})
  }
})

//GET one user
router.get('/:id', async (req, res, next) => {
  const user = await User.findOne({_id: req.params.id})
  res.status(200).json(user)
});

//POST new user
router.post('/',uploadMiddleware.single('avatar'), async (req, res) => {
  let user = new User({
    username: req.body.username,
  })
  if (req.file) {
    user.avatar = req.file.path
  }
  user.save()
  .then(response => {
    res.status(200).json({
      message: "User Added Successfully!"
    })
  })
  .catch(err => {
    res.status(400).json({
      message: err
    })
  })
  
})

//PUT existing user
router.put('/:id',uploadMiddleware.single('avatar'), async (req, res) => {
  try {
    let user = await User.findOne({_id: req.params.id})
    if (req.body.OwnedItems) {
      user.OwnedItems = req.body.OwnedItems
    } 
    if (req.file) {
      if (user.avatar) {
        fs.unlinkSync(user.avatar)
      }
      user.avatar = req.file.path
    }
    user.save()
    .then(response => {
      res.status(200).json({
        message: "User Updated Successfully!"
      })
    })
    .catch(err => {
      res.status(400).json({
        message: "error"
      })
    })
  } catch (e) {
    res.status(400).json({message: "error in try"})
  }
})

module.exports = router;
