const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


/****** USER CREATE ******/
router.post('/create', function(req, res){
  let newUser = {
    passwordhash: bcrypt.hashSync(req.body.password, 12),
    userName: req.body.userName,
    isAdmin: req.body.isAdmin,
    pollsVotedOn: []
  };
  
  User.create(newUser)
  .then((user) => {
    let token = jwt.sign(
      {id: user.id}, 
      process.env.JWT_SECRET, 
      {expiresIn: 60*60*24}
    )
    res.status(200).json(
      {
        userId: user.id,
        userName: user.userName,
        isAdmin: user.isAdmin,
        pollsVotedOn: user.pollsVotedOn,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
        sessionToken: token
      }
    );
  })
  .catch(err => {
    return res.status(500).json({error: err, message:"Failed to register new user"})
  })
});

/****** USER LOGIN ******/
router.post('/login', function(req, res){
  
  User.findOne({
    where: {
      userName: req.body.userName
    }
  })
  .then((user) => {
    if (user){
      bcrypt.compare(req.body.password, user.passwordhash, (err, matches) => {
        if (matches) {
          let token = jwt.sign(
            {id: user.id}, 
            process.env.JWT_SECRET, 
            {expiresIn: 60*60*24}
          );
          res.status(200).json(
            {
              userId: user.id,
              userName: user.userName,
              isAdmin: user.isAdmin,
              pollsVotedOn: user.pollsVotedOn,
              sessionToken: token
            }
          );
        }else{
          res.status(502).json({error: "Login failed"});
        }
      });
    }else{
      res.status(500).json({error: "User not found"});
    }
  })
  .catch(err => {
    return res.status(500).json({error: err, message:"Failed to login user"})
  });
});


module.exports = router;