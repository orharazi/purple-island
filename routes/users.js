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
    isNew: true
  })
  if (req.file) {
    user.avatar = req.file.path
  } else {
    user.avatar = 'public/images/avatars/defaultUserPic.jpg'
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
router.put('/:id', uploadMiddleware.single('avatar'), async (req, res) => {
  try {
    let user = await User.findOne({_id: req.params.id})
    if (req.body.username) {
      user.username = req.body.username
    }
    if (req.body.OwnedItems) {
      let items = JSON.parse(req.body.OwnedItems)
      console.log("items: " + items)
      user.OwnedItems = items
      if (user.isNew) {
        user.isNew = false
      }
    } 
    if (req.file) {
      if (user.avatar !== 'public/images/avatars/defaultUserPic.jpg') {
        fs.unlinkSync(user.avatar)
      }
      console.log("file Found!", req.file)
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
        message: err
      })
    })
  } catch (e) {
    res.status(400).json({message: e})
  }
})

module.exports = router;
