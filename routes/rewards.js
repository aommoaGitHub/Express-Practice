const express = require('express');
const router = express.Router();

// Bring in Reward/User model
const Reward = require('../models/reward') //เรา export มาแค่ reward
const User = require('../models/user')

// Add Route
router.get('/add', ensureAuthenticated, function(req, res) {
  res.render('add_reward', {
    title: 'Add rewards'
  })
});

// Add Submit POST Routes
router.post('/add', function(req, res) {
  req.checkBody('type','Type is Required').notEmpty();
  // req.checkBody('winner_name','Winner Name is Required').notEmpty();
  req.checkBody('detail','Detail is Required').notEmpty();

  // Get Error
  let errors = req.validationErrors();
  if(errors){
    res.render('add_reward',{
      title: 'Add reward',
      errors: errors
    });
  }else{
    let reward = new Reward()

    reward.type = req.body.type
    reward.winner_name = req.user._id;
    reward.detail = req.body.detail

    reward.save(function(err){
      if(err){
        console.log(err)
        return
      }else{
        req.flash('success','Reward Added');
        res.redirect('/')
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req,res){
  Reward.findById(req.params.id, function(err, reward){
    if(reward.winner_name != req.user._id){
      req.flash('danger','Not Authorized');
      return res.redirect('/');
    }
    res.render('edit_reward',{
      title: 'Edit Reward',
      reward : reward
    });
  });
});

// Update Submit POST Routes
router.post('/edit/:id', function(req, res) {
  let reward = {};
  reward.type = req.body.type
  reward.winner_name = req.body.winner_name
  reward.detail = req.body.detail

  let query = {_id:req.params.id}

  Reward.update(query,reward,function(err){
    if(err){
      console.log(err)
      return
    }else{
      req.flash('success','Reward Updated');
      res.redirect('/')
    }
  });
});

// Delete Reward
router.delete('/:id',function(req,res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Reward.findById(req.params.id, function(err, reward){
    if(reward.winner_name != req.user._id){
      res.status(500).send();
    }else{
      Reward.remove(query, function(err){
        if(err){
          console.log(err);
        }
        req.flash('success','Reward deleted');
        res.send('Success');
      });
    }
  });
});

// Get Single Rewards
router.get('/:id', function(req,res){
  Reward.findById(req.params.id, function(err, reward){
    User.findById(reward.winner_name, function(err, user){
      res.render('reward',{
        reward : reward,
        winner_name : user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger','Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
